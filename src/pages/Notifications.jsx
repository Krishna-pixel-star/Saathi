import {
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const notifications = [
  {
    id: 1,
    title: 'Tomato demand is rising in Varanasi',
    detail: 'Three nearby buyers increased their offer above the weekly mandi average.',
    time: '12 min ago',
    icon: ArrowTrendingUpIcon,
    tone: 'green',
  },
  {
    id: 2,
    title: 'Order pickup needs confirmation',
    detail: 'AgriKart Wholesale is waiting on tomorrow morning pickup for 18 qtl wheat.',
    time: '42 min ago',
    icon: ExclamationTriangleIcon,
    tone: 'amber',
  },
  {
    id: 3,
    title: 'Mustard listing matched with two buyers',
    detail: 'SAATHI found buyers within 28 km who accept your preferred quantity.',
    time: '2 hr ago',
    icon: CheckCircleIcon,
    tone: 'emerald',
  },
  {
    id: 4,
    title: 'Transport route updated',
    detail: 'The Chandauli cold-chain route is currently 35 minutes faster than usual.',
    time: 'Today',
    icon: TruckIcon,
    tone: 'sky',
  },
];

const toneClasses = {
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  green: 'bg-green-50 text-green-700',
  sky: 'bg-sky-50 text-sky-700',
};

export default function Notifications() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2E7D32]">Alerts</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Notifications</h1>
        <p className="mt-2 text-base text-slate-600">
          Buyer activity, price signals, and logistics updates that need your attention.
        </p>
      </header>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;

          return (
            <article
              key={notification.id}
              className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  toneClasses[notification.tone]
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-base font-extrabold text-slate-900">{notification.title}</h2>
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-slate-400">
                    {notification.time}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{notification.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
