"""Pure simulation policy; does not authorize on-chain GEN transfers."""
from hashlib import sha256
import json
def canonical(v): return json.dumps(v,sort_keys=True,separators=(",",":"))
def digest(v): return sha256(canonical(v).encode()).hexdigest()
def validate_terms(terms):
    tasks=terms.get("tasks")
    if not isinstance(tasks,list) or not 1<=len(tasks)<=8: raise ValueError("1..8 tasks required")
    if sum(t.get("weight",0) for t in tasks)!=100: raise ValueError("weights must total 100")
    ids=set()
    for t in tasks:
        if set(t)!={"id","question","weight","critical","issuer"}: raise ValueError("schema")
        if not 1<=len(t["id"])<=20 or t["id"] in ids: raise ValueError("duplicate/invalid id")
        ids.add(t["id"])
        if type(t["weight"]) is not int or not 1<=t["weight"]<=100: raise ValueError("weight")
        if type(t["critical"]) is not bool: raise ValueError("critical")
        if not 20<=len(t["question"])<=400: raise ValueError("question")
        if len(t["issuer"])!=42 or not t["issuer"].startswith("0x"): raise ValueError("issuer")
    return True
def decide(terms,answers):
    validate_terms(terms)
    if set(answers)!={t["id"] for t in terms["tasks"]}: raise ValueError("result set")
    if any(v not in ("PASS","FAIL","UNKNOWN") for v in answers.values()): raise ValueError("result label")
    if any(t["critical"] and answers[t["id"]]=="FAIL" for t in terms["tasks"]): return {"status":"REJECTED","score":0}
    if "UNKNOWN" in answers.values(): return {"status":"INCONCLUSIVE","score":0}
    score=sum(t["weight"] for t in terms["tasks"] if answers[t["id"]]=="PASS")
    return {"status":"APPROVED" if score==100 else ("PARTIAL" if score else "REJECTED"),"score":score}
def allocate(deposit,score):
    if not isinstance(deposit,int) or deposit<0 or not 0<=score<=100: raise ValueError("amount")
    operator=deposit*score//100
    return {"operator":operator,"client":deposit-operator}
