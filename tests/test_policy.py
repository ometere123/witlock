import sys
from pathlib import Path
import pytest
sys.path.insert(0,str(Path(__file__).parents[1]))
from policy.rules import decide,validate_terms,allocate,digest,timeout_status,validate_attestation
A='0x'+'1'*40
T={'tasks':[{'id':'code','question':'Does the approved repository contain the specified deliverable source?','weight':65,'critical':True,'issuer':A},{'id':'deploy','question':'Does the authorized release record correspond to the approved source revision?','weight':35,'critical':False,'issuer':A}]}
def test_all_pass(): assert decide(T,{'code':'PASS','deploy':'PASS'})['score']==100
def test_partial(): assert decide(T,{'code':'PASS','deploy':'FAIL'})['score']==65
def test_critical_fail(): assert decide(T,{'code':'FAIL','deploy':'PASS'})['score']==0
def test_unknown(): assert decide(T,{'code':'PASS','deploy':'UNKNOWN'})['status']=='INCONCLUSIVE'
def test_missing():
    with pytest.raises(ValueError): decide(T,{'code':'PASS'})
def test_duplicate():
    with pytest.raises(ValueError): validate_terms({'tasks':[dict(T['tasks'][0],weight=50),dict(T['tasks'][0],weight=50)]})
def test_allocations():
    for n in [0,1,101,10**18]:
        for s in range(101):
            d=allocate(n,s)
            assert d['operator']+d['client']==n
def test_negative():
    with pytest.raises(ValueError):allocate(-1,50)
def test_canonical_hash(): assert digest({'b':2,'a':1})==digest({'a':1,'b':2})

def test_attestation_requires_nominated_external_issuer():
    task=T['tasks'][0]
    evidence={'issuer':A,'subject':'WL-1:code','digest':'a'*64,'claim':'The release exists.','source':'https://issuer.example/release/1','registry_key':'issuer-1'}
    with pytest.raises(ValueError): validate_attestation(evidence,task,[A,'0x'+'2'*40],'WL-1:code')

def test_attestation_binds_subject_and_registry_key():
    issuer='0x'+'3'*40
    task=dict(T['tasks'][0],issuer=issuer)
    evidence={'issuer':issuer,'subject':'WL-1:code','digest':'a'*64,'claim':'The release exists.','source':'https://issuer.example/release/1','registry_key':'issuer-1'}
    assert validate_attestation(evidence,task,['0x'+'2'*40],'WL-1:code')
    with pytest.raises(ValueError): validate_attestation(evidence,task,['0x'+'2'*40],'WL-2:code')

def test_timeouts_only_open_after_their_deadline():
    assert timeout_status('DRAFT',101,100,200)=='EXPIRED'
    assert timeout_status('ACTIVE',201,100,200)=='TIMED_OUT'
    with pytest.raises(ValueError): timeout_status('ACTIVE',199,100,200)
