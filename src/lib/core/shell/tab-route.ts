import { SvelteMap } from 'svelte/reactivity';

/** Route state local to a mounted keep-alive tab, independent of global page state. */
export const TAB_ROUTE = Symbol('portable-tab-route');

export interface TabRoute {
	readonly pathname: string;
	readonly url: URL;
	readonly params: Record<string, string>;
	readonly data: unknown;
	readonly form: unknown;
}

function copyRoute(route: TabRoute): TabRoute {
	return { ...route, url: new URL(route.url), params: { ...route.params } };
}

/** Internal cache shared by the outlet and its focused regression tests. */
export class TabRouteCache {
	#tabs = new SvelteMap<string, TabRoute>();
	#urls = new Map<string, TabRoute>();
	#sources = new Map<string, TabRoute>();
	#lastRoute?: TabRoute;
	#pendingRoute?: TabRoute;

	sync(
		tabs: readonly { id: string; url: string; route?: TabRoute }[],
		active: string,
		currentUrl: string,
		route?: TabRoute
	): void {
		if (route && route !== this.#lastRoute) {
			this.#lastRoute = route;
			this.#pendingRoute = copyRoute(route);
			this.#urls.set(currentUrl, this.#pendingRoute);
		}
		const ids = new Set(tabs.map((tab) => tab.id));
		const urls = new Set(tabs.map((tab) => tab.url));
		for (const tab of tabs) {
			if (tab.route && tab.route !== this.#sources.get(tab.id)) {
				this.#tabs.set(tab.id, copyRoute(tab.route));
				this.#sources.set(tab.id, tab.route);
			}
			const snapshot =
				route && tab.url === currentUrl && tab.id === active ? this.#pendingRoute : undefined;
			if (snapshot) {
				this.#tabs.set(tab.id, copyRoute(snapshot));
				this.#pendingRoute = undefined;
			} else if (!this.#tabs.has(tab.id)) {
				const loaded = this.#urls.get(tab.url);
				if (loaded) this.#tabs.set(tab.id, copyRoute(loaded));
			}
		}
		for (const id of this.#tabs.keys()) {
			if (!ids.has(id)) {
				this.#tabs.delete(id);
				this.#sources.delete(id);
			}
		}
		for (const url of this.#urls.keys()) {
			if (!urls.has(url) && url !== currentUrl) this.#urls.delete(url);
		}
	}

	get(id: string): TabRoute | undefined {
		return this.#tabs.get(id);
	}
}
