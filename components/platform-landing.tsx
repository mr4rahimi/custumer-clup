import { BusinessSignupForm } from "@/components/business-signup-form";

const FEATURES = [
  {
    title: "عضویت آسان با موبایل",
    description: "مشتریان شما فقط با وارد کردن شماره موبایل، در چند ثانیه عضو باشگاه می‌شوند.",
  },
  {
    title: "سطح‌بندی مشتریان",
    description: "مشتریان وفادار به‌صورت خودکار به سطح نقره‌ای و طلایی ارتقا پیدا می‌کنند.",
  },
  {
    title: "پیامک و کمپین هوشمند",
    description: "با مشتریان خود از طریق پیامک در ارتباط باشید و آن‌ها را برای بازگشت دوباره ترغیب کنید.",
  },
  {
    title: "پنل مدیریت اختصاصی",
    description: "آمار اعضا، مشتریان جدید و گزارش‌های لحظه‌ای کسب‌وکار خودتان را ببینید.",
  },
];

export function PlatformLanding() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">باشگاه مشتریان برتر</h1>
        <p className="max-w-2xl text-lg text-neutral-600">
          هم‌اکنون در باشگاه مشتریان ثبت‌نام کنید تا همیشه با مشتریان خود در ارتباط باشید — مخصوص تمامی کسب‌وکارها
        </p>
        <p className="max-w-xl text-sm text-neutral-500">
          بدون نیاز به دانش فنی، در کمتر از چند دقیقه باشگاه مشتریان اختصاصی کسب‌وکار خودتان را راه‌اندازی کنید.
        </p>
        <a href="#signup" className="rounded-full bg-neutral-900 px-8 py-3 text-white shadow-lg hover:bg-neutral-800">
          ثبت‌نام رایگان کسب‌وکار
        </a>
      </section>

      <section className="grid grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-neutral-200 p-6">
            <h3 className="mb-2 font-bold">{feature.title}</h3>
            <p className="text-sm text-neutral-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section id="signup" className="flex flex-col items-center gap-6 px-6 py-16">
        <h2 className="text-2xl font-bold">ثبت‌نام کسب‌وکار</h2>
        <BusinessSignupForm />
      </section>

      <footer className="border-t border-neutral-200 px-6 py-6 text-center text-sm text-neutral-500">
        © باشگاه مشتریان
      </footer>
    </main>
  );
}
