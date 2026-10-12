"""Cross-platform entry point for the pinned genvm-linter package."""

import os

# The contract headers pin the py-genlayer runner shipped in v0.2.16. Newer
# cached manager bundles can be selected automatically by genvm-linter but do
# not contain that concrete runner hash.
os.environ.setdefault("GENVM_VERSION", "v0.2.16")

from genvm_linter.cli import cli


if __name__ == "__main__":
    cli()
