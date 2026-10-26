import { demoProducts, type DemoProduct } from './products';

export interface CartItem extends DemoProduct {
	quantity: number;
}

/** Initial demo cart; each page clones these records before editing quantities. */
export const demoCartItems: CartItem[] = [
	{ ...demoProducts[1]!, quantity: 1 },
	{ ...demoProducts[4]!, quantity: 1 },
	{ ...demoProducts[3]!, quantity: 2 },
	{ ...demoProducts[8]!, quantity: 1 }
];
