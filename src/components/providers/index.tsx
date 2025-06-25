import { ThemeProvider } from './theme';
import { QueryProvider } from './query';
export default function Page({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
