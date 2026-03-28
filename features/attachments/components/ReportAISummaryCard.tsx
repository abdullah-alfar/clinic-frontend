import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';
import { useReportAnalyses } from '../hooks/useAttachments';

interface Props {
  attachmentId: string;
}

export function ReportAISummaryCard({ attachmentId }: Props) {
  const { data: analyses, isLoading } = useReportAnalyses(attachmentId);

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  // Find the latest completed summary if any
  const latestSummary = analyses?.find((a) => a.analysis_type === 'summary' && a.status === 'completed');

  if (!latestSummary) {
    return null;
  }

  return (
    <Card className="mt-4 border-primary/20 bg-primary/5">
      <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 border-b border-primary/10">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <CardTitle className="text-base font-semibold text-primary">AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-4 pb-4 space-y-4">
        <p className="text-sm leading-relaxed">{latestSummary.summary}</p>

        {latestSummary.structured_data?.key_metrics && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Key Findings</span>
            <ul className="space-y-1">
              {latestSummary.structured_data.key_metrics.map((metric, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  {latestSummary.structured_data?.abnormal_results ? (
                    <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  )}
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {latestSummary.structured_data?.recommendations && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Recommendations</span>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              {latestSummary.structured_data.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-[10px] text-muted-foreground italic pt-2 border-t border-primary/10">
          {latestSummary.structured_data?.disclaimer || 'AI assistance only. Not medical advice.'}
        </div>
      </CardContent>
    </Card>
  );
}
