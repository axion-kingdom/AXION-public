# Public governance

This repository follows one rule: source is included only when it is classified `PUBLIC` or `REVIEWED-SAFE`.

Anything unresolved is excluded. The private operational repository and its production systems are outside this tree.

Required checks before a change is accepted:

1. surface scan
2. lint
3. typecheck
4. unit tests
5. build
6. dependency audit for critical findings

The hosted runner for those checks is the standard GitHub-hosted Ubuntu runner. This repository has no deployment workflow.
