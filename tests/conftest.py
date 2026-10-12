"""Test harness compatibility for the installed GenLayer Direct Mode plugin."""

import hashlib
import os
import sys
from pathlib import Path

import pytest

import gltest.direct.loader as direct_loader
from gltest.direct.sdk_loader import setup_sdk_paths
from gltest.direct.vm import VMContext


def _address(seed: str):
    setup_sdk_paths(Path("contracts/WitlockRegistry.py"), "v0.2.16")
    from genlayer.py.types import Address

    return Address(hashlib.sha256(seed.encode()).digest()[:20])


@pytest.fixture
def direct_alice():
    return _address("alice")


@pytest.fixture
def direct_bob():
    return _address("bob")


@pytest.fixture
def direct_charlie():
    return _address("charlie")


# The installed Direct Mode VM refreshes sender and origin but leaves the
# timestamp in message_raw unchanged after vm.warp(). Keep the test clock
# aligned with the message seen by the contract on every supported OS.
_original_refresh = VMContext._refresh_gl_message


def _refresh_gl_message_with_datetime(self: VMContext) -> None:
    _original_refresh(self)
    gl = sys.modules.get("genlayer.gl")
    if gl is not None and hasattr(gl, "message_raw"):
        gl.message_raw["datetime"] = self._datetime


VMContext._refresh_gl_message = _refresh_gl_message_with_datetime


if os.name == "nt":
    import tempfile

    # The installed Windows loader tries to unlink stdin's backing file before
    # the duplicated handle is restored. Defer that unlink until VM cleanup.
    def _inject_message_to_fd0_windows(vm: VMContext) -> None:
        from genlayer.py import calldata
        from genlayer.py.types import Address

        sender = vm.sender
        if isinstance(sender, bytes):
            sender = Address(sender)
        contract = vm._contract_address
        if isinstance(contract, bytes):
            contract = Address(contract)
        origin = vm.origin
        if isinstance(origin, bytes):
            origin = Address(origin)

        message = {
            "contract_address": contract,
            "sender_address": sender,
            "origin_address": origin,
            "stack": [],
            "value": vm._value,
            "datetime": vm._datetime,
            "is_init": False,
            "chain_id": vm._chain_id,
            "entry_kind": 0,
            "entry_data": b"",
            "entry_stage_data": None,
        }
        encoded = calldata.encode(message)
        fd, path = tempfile.mkstemp()
        try:
            os.write(fd, encoded)
            os.lseek(fd, 0, os.SEEK_SET)
            vm._original_stdin_fd = os.dup(0)
            os.dup2(fd, 0)
            vm._direct_message_path = Path(path)
        finally:
            os.close(fd)

    _original_cleanup = VMContext._cleanup_after_deactivate

    def _cleanup_after_deactivate_windows(self: VMContext) -> None:
        path = getattr(self, "_direct_message_path", None)
        try:
            _original_cleanup(self)
        finally:
            if path is not None:
                try:
                    path.unlink()
                except FileNotFoundError:
                    pass
                self._direct_message_path = None

    direct_loader._inject_message_to_fd0 = _inject_message_to_fd0_windows
    VMContext._cleanup_after_deactivate = _cleanup_after_deactivate_windows
