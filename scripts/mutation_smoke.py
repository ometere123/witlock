"""Run small, targeted mutation checks against the executable Direct Mode suite.

This intentionally uses only the standard library. Each mutant is run from an
isolated copy of the contract and test harness; a non-zero pytest exit is the
required kill signal. It is a release gate for the high-risk deadline, policy,
and replay branches rather than a replacement for the full test suite.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / "contracts" / "Witlock.py"


MUTANTS = (
    (
        "appeal_window_zero",
        "MIN_APPEAL_WINDOW_SECONDS = 15 * 60",
        "MIN_APPEAL_WINDOW_SECONDS = 0",
        "tests/test_contracts_direct.py::test_adjudication_and_resolved_appeal_can_finalize",
    ),
    (
        "draft_refund_replay_guard_removed",
        'if int(agreement["funding_refund_attempt"]) != 0:',
        'if int(agreement["funding_refund_attempt"]) == 0:',
        "tests/test_contracts_direct.py::test_funded_draft_recovery_is_exact_one_use_and_bounded",
    ),
    (
        "inconclusive_bps_upper_bound_widened",
        "MAX_BPS = 10_000",
        "MAX_BPS = 10_001",
        "tests/test_contracts_direct.py::test_inconclusive_policy_rejects_out_of_bounds_bps",
    ),
)


def main() -> int:
    killed = 0
    for name, needle, replacement, target in MUTANTS:
        with tempfile.TemporaryDirectory(prefix="witlock-mutant-") as temp:
            workspace = Path(temp)
            (workspace / "contracts").mkdir()
            (workspace / "tests").mkdir()
            source = CONTRACT.read_text(encoding="utf-8")
            if source.count(needle) != 1:
                raise RuntimeError(f"mutation needle is not unique: {name}")
            (workspace / "contracts" / "Witlock.py").write_text(
                source.replace(needle, replacement), encoding="utf-8"
            )
            for filename in ("conftest.py", "test_contracts_direct.py"):
                shutil.copy2(ROOT / "tests" / filename, workspace / "tests" / filename)
            result = subprocess.run(
                [sys.executable, "-m", "pytest", "-q", target],
                cwd=workspace,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=False,
            )
            if result.returncode == 0:
                print(f"SURVIVED {name}\n{result.stdout}")
                continue
            killed += 1
            print(f"KILLED {name}")
    print(f"mutation_smoke: {killed}/{len(MUTANTS)} killed")
    return 0 if killed == len(MUTANTS) else 1


if __name__ == "__main__":
    raise SystemExit(main())
