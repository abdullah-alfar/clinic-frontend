import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { SectionCard } from '@/components/layout/SectionCard';
import { Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTestAI } from '../hooks';
import { toast } from 'sonner';

export function AISettings() {
  const { control } = useFormContext();
  const isEnabled = useWatch({ control, name: 'ai_enabled' });

  return (
    <SectionCard title="AI Intelligence Engine" icon={Bot} description="Configure AI providers to unlock advanced system capabilities.">
      <div className="space-y-8">
        <FormField
          control={control}
          name="ai_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900/50">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Enable System Auto-Intelligence
                </FormLabel>
                <FormDescription>
                  Enables report analysis, smart scheduling, and conversational agents.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isEnabled && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t pt-8">
            <div className="space-y-6">
              <FormField
                control={control}
                name="ai_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Processing Engine</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI engine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="log">Local Log (Dev only)</SelectItem>
                        <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                        <SelectItem value="gemini">Google Gemini (Flash 2.0)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <APIKeyField />
            </div>

            <div className="lg:border-l lg:pl-8">
              <AIPlayground />
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function APIKeyField() {
  const { control } = useFormContext();
  const isSet = useWatch({ control, name: 'ai_api_key_is_set' });
  const [editing, setEditing] = useState(!isSet);

  return (
    <FormField
      control={control}
      name="ai_api_key"
      render={({ field }) => (
        <FormItem>
          <FormLabel>API Key</FormLabel>
          {!editing ? (
            <div className="flex gap-2 items-center w-full">
              <Input value="sk-••••••••••••••••••••••••" disabled className="bg-muted text-muted-foreground font-mono" />
              <Button type="button" variant="outline" onClick={() => setEditing(true)}>Update Key</Button>
            </div>
          ) : (
            <FormControl>
              <Input type="password" placeholder="Enter new API Key" {...field} />
            </FormControl>
          )}
          <FormDescription>Encrypted at rest using AES-256-GCM. Never exposed in plain text.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function AIPlayground() {
  const [prompt, setPrompt] = useState('Write a 2 sentence welcome message for Acme Clinic.');
  const [response, setResponse] = useState<{ text: string, provider: string } | null>(null);
  const mut = useTestAI();

  const handleTest = async () => {
    if (!prompt.trim()) return;
    setResponse(null);
    try {
      const res = await mut.mutateAsync(prompt);
      setResponse({ text: res.response, provider: res.provider });
    } catch {
      toast.error('AI provider test failed. Check your API key.');
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border bg-muted/20 overflow-hidden shadow-inner">
      <div className="bg-muted/50 p-3 border-b border-border/50">
        <h4 className="text-sm font-bold flex items-center gap-2">
          <Bot className="h-4 w-4 text-indigo-500" /> AI Playground
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">Test your current AI configuration live.</p>
      </div>
      
      <div className="p-4 flex-1 min-h-[150px] max-h-[300px] overflow-y-auto text-sm">
        {mut.isPending ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            <span className="text-xs">Generating response...</span>
          </div>
        ) : response ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              <Sparkles className="h-3 w-3" /> {response.provider}
            </div>
            <div className="prose prose-sm dark:prose-invert text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {response.text}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic opacity-70">
            Submit a prompt to test the AI...
          </div>
        )}
      </div>

      <div className="p-3 bg-background border-t">
        <div className="flex gap-2">
          <Input 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)} 
            placeholder="Ask the AI something..." 
            className="text-sm shadow-none"
            onKeyDown={e => e.key === 'Enter' && handleTest()}
            disabled={mut.isPending}
          />
          <Button onClick={handleTest} disabled={mut.isPending || !prompt.trim()} size="icon" className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
