# 发布与下游交接

稳定版本交付 annotated `vX.Y.Z` tag，以及 `svelte-admin-export.json` 选中的 `src/lib/core/**` 和 `LICENSE`。产品集成在下游仓库完成。

## 范围与准备

仅升版本时，更新 `package.json` 和 `package-lock.json` 的顶层及根包版本，核对三处一致后结束。完整发布请求涵盖提交、tag、push 和 GitHub Release；已有授权无需重复确认。

默认从与远端同步的 `main` 发布，用户指定其他分支时按其要求。先检查分支、远端和工作树，保留无关改动；需要隔离时使用独立 checkout，不自动提交或 stash 用户的工作。版本号按用户指定，否则升一个 patch。

准备发布内容后运行 `npm run verify`，包含类型、格式、测试、构建和 portable-core 导出检查。已对同一内容通过的检查无需重复。`check:export` 验证导出范围、依赖闭合以及路径安全。

提交应只包含本次发布的内容，版本提交可用 `chore: bump version to X.Y.Z`。根据上一发布 tag 到目标提交的差异准备 Release Notes，明确 core 的新增、修改、删除、依赖变化和迁移要求。只有 `src/lib/core/` 无变化时才写“core 无变化”；`src/lib/shell` 是应用适配器，`src/lib/core/shell` 属于 portable core。

## 完整发布

下列变量是示例，替换为已核实的目标。先确认本地与远端都没有同名 tag 或 release。

```bash
release_branch=main
release_tag=vX.Y.Z
release_notes=/path/to/release-notes.md

git push origin "$release_branch"
```

确认目标提交的 GitHub CI 通过后，创建 annotated tag 并发布：

```bash
git tag -a "$release_tag" -m "$release_tag"
git push origin "refs/tags/$release_tag"
gh release create "$release_tag" --verify-tag \
  --title "Svelte Admin Starter $release_tag" \
  --notes-file "$release_notes" --latest

git ls-remote origin "refs/tags/$release_tag" "refs/tags/$release_tag^{}"
gh release view "$release_tag" --json url,tagName,isDraft,isPrerelease
```

核对远端 tag 指向预期提交，Release 已公开且 Latest 状态正确，再报告发布 URL。预发布版本不标为 Latest。

失败后先查清哪些步骤已经生效，再决定续跑；状态不明时停止后续发布操作并报告。稳定 tag 不得移动、删除或覆盖，修复通过新的 patch 发布。
