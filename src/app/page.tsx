/**
 * Home page - Main calendar view
 */

import { CalendarContainer } from '@components/Calendar';

export default function Home() {
  return (
    <main>
      <CalendarContainer
        disablePastDates={false}
        showThemeToggle={true}
      />
    </main>
  );
}
