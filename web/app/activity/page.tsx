import TransactionHistory from '@/app/_components/TransactionHistory';
import { RouteShell } from '@/app/_components/RouteShell';

export default function ActivityPage() {
  return <RouteShell eyebrow="Transaction activity" title="Keep every write accountable." intro="Submission status, finalized execution, and recovery history stay available on their own route. A receipt is not treated as successful unless consensus is finalized and GenVM reports FINISHED_WITH_RETURN.">
    <TransactionHistory />
  </RouteShell>;
}
