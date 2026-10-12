# State machine

| From | Transition | Caller | Guard | To |
| --- | --- | --- | --- | --- |
| none | `create_case` | requester | valid criteria, external issuers, ordered future deadlines, unique key | `DRAFT` |
| `DRAFT` | `accept_case` | provider | sender is frozen provider and current time is within accept deadline | `ACTIVE` |
| `DRAFT` | `timeout_case` | anyone | current time is after accept deadline | `EXPIRED` |
| `ACTIVE` | `submit_evidence` | requester or provider | before delivery deadline, criterion exists, registry key unused | `ACTIVE` |
| `ACTIVE` | `authenticate_evidence` | nominated issuer | exact immutable registry record match | `ACTIVE` |
| `ACTIVE` | `seal_case` | requester | requester is frozen party | `SEALED` |
| `ACTIVE` | `timeout_case` | anyone | current time is after delivery deadline | `TIMED_OUT` |
| `SEALED` | `adjudicate` | anyone | every criterion has authenticated evidence; consensus returns valid bounded labels | outcome |
| `SEALED` | `close_inconclusive` | anyone | delivery deadline has passed | `INCONCLUSIVE` |
| outcome | `open_appeal` | requester or provider | before appeal deadline, no earlier appeal, valid reason digest | `APPEALED` |
| `APPEALED` | `resolve_appeal` | anyone | every criterion remains authenticated; new consensus succeeds | outcome |

`APPROVED`, `PARTIAL`, `REJECTED`, `INCONCLUSIVE`, `TIMED_OUT`, and `EXPIRED` do not expose any value exit. `APPEALED` is a decision review state and never authorizes payment. Every mutating transition appends a history record; criteria, issuer addresses, deadlines, and recipient policy cannot be modified after creation.
