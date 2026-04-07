import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionCard } from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeSettings() {
  const { control, setValue } = useFormContext();
  const { setTheme } = useNextTheme();
  
  // Watch theme value to sync with next-themes dynamically on form change
  const currentTheme = useWatch({ control, name: 'theme' });

  useEffect(() => {
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [currentTheme, setTheme]);

  return (
    <SectionCard title="Interface Theme" icon={Palette} description="Customize colors and appearance modes.">
      <div className="space-y-6">
        <FormField
          control={control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appearance</FormLabel>
              <div className="grid grid-cols-3 gap-4 border rounded-xl p-2 bg-muted/20">
                <ThemeButton 
                  active={field.value === 'light'} 
                  onClick={() => field.onChange('light')} 
                  icon={Sun} 
                  label="Light" 
                />
                <ThemeButton 
                  active={field.value === 'dark'} 
                  onClick={() => field.onChange('dark')} 
                  icon={Moon} 
                  label="Dark" 
                />
                <ThemeButton 
                  active={field.value === 'system'} 
                  onClick={() => field.onChange('system')} 
                  icon={Monitor} 
                  label="System" 
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <FormField
            control={control}
            name="primary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color (Hex)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input type="color" className="w-12 h-10 p-1 cursor-pointer bg-transparent border-0" {...field} />
                    <Input placeholder="#6366f1" className="font-mono" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color (Hex)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input type="color" className="w-12 h-10 p-1 cursor-pointer bg-transparent border-0" {...field} />
                    <Input placeholder="#8b5cf6" className="font-mono" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function ThemeButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "flex flex-col h-20 gap-2 border-border/60 hover:bg-muted/50 transition-all shadow-none",
        active && "border-primary bg-primary/5 text-primary ring-1 ring-primary/30"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}
