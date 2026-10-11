# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json
class WitlockRegistry(gl.Contract):
    records: TreeMap[str,str]
    record_count: u256
    def __init__(self): self.record_count=u256(0)
    @gl.public.write
    def attest(self,key:str,subject:str,evidence_hash:str,claim:str)->None:
        if not 1<=len(key)<=100 or not 1<=len(subject)<=100: raise Exception("invalid key or subject")
        if len(evidence_hash)!=64 or any(c not in "0123456789abcdef" for c in evidence_hash): raise Exception("digest")
        if not 1<=len(claim)<=400: raise Exception("claim length")
        if self.records.get(key,""): raise Exception("id used")
        self.records[key]=json.dumps({"issuer":gl.message.sender_address.as_hex.lower(),"subject":subject,"digest":evidence_hash,"claim":claim},sort_keys=True)
        self.record_count=u256(int(self.record_count)+1)
    @gl.public.view
    def get_attestation(self,key:str)->str: return self.records.get(key,"")
    @gl.public.view
    def count(self)->int: return int(self.record_count)
