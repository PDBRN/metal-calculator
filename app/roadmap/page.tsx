import Link from "next/link";

export default function RoadmapPage() {
  const steps = [
    {
      id: "01",
      title: "Профессиональная генерация КП (PDF)",
      desc: "Возможность скачать результат расчета в виде красиво оформленного PDF-файла с вашим логотипом, контактами и итоговой ценой. Идеально для быстрой отправки клиентам.",
      status: "Ready for Dev",
      color: "bg-blue-500",
    },
    {
      id: "02",
      title: "Интеллектуальный справочник металлов",
      desc: "Полная база данных по ГОСТам, химсоставам и физическим свойствам каждой выбранной марки стали. Интеграция с калькулятором для выбора более дешевых или качественных аналогов.",
      status: "Planning",
      color: "bg-purple-500",
    },
    {
      id: "03",
      title: "Real-time мониторинг цен",
      desc: "Автоматическое обновление цен сотни поставщиков в реальном времени. Система «Биржа Металла», где вы видите лучшую цену по региону прямо под результатом расчета.",
      status: "In Progress",
      color: "bg-emerald-500",
    },
    {
      id: "04",
      title: "Личный кабинет и история расчётов",
      desc: "Облачное хранилище всех ваших смет. Возможность группировать расчеты по проектам, делиться ими с коллегами по ссылке и вносить правки в любой момент.",
      status: "Planning",
      color: "bg-zinc-800",
    },
    {
      id: "05",
      title: "Голосовой ввод и распознавание чертежей",
      desc: "Функция «диктовки» размеров или загрузки фото чертежа с автоматическим распознаванием полей. Навел камеру на спецификацию — получил готовый расчет веса и стоимости.",
      status: "Concept",
      color: "bg-orange-500",
    },
    {
      id: "06",
      title: "Расчёт логистики и доставки",
      desc: "Автоматический подбор подходящего транспорта (кузов, тоннаж) исходя из веса и габаритов заказанных позиций. Интеграция с картами для расчета стоимости рейса.",
      status: "Concept",
      color: "bg-indigo-500",
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 font-sans pb-20">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-900 group">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-bold text-sm uppercase tracking-wider">Назад к калькулятору</span>
          </Link>
          <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
            Vision 2026
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-16">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-black text-zinc-900 mb-6 tracking-tight">
            Чего мы можем <br />
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8 decoration-4">достичь</span> вместе
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Этот калькулятор — лишь вершина айсберга. Ниже представлены идеи и прототипы функций, которые превратят его в полноценный инструмент автоматизации вашего бизнеса.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {steps.map((step) => (
            <div key={step.id} className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl shadow-zinc-200/40 hover:shadow-2xl hover:shadow-zinc-300/40 transition-all group flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className={`w-12 h-12 ${step.color} text-white flex items-center justify-center rounded-2xl text-xl font-bold shadow-lg shadow-${step.color.split('-')[1]}-200/40`}>
                  {step.id}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-zinc-50 text-zinc-400 rounded-full border border-zinc-100">
                  {step.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-blue-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow">
                {step.desc}
              </p>
              <div className="pt-6 border-t border-zinc-50 mt-auto">
                <button className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 hover:text-blue-500 transition-colors">
                  Обсудить реализацию
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="bg-zinc-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">Вашей идеи нет в списке?</h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8 relative z-10 text-lg">
            Мы можем реализовать любую кастомную логику, которая нужна вашему отделу продаж или инженерам.
          </p>
          <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 relative z-10">
            Связаться с разработчиком
          </button>
        </div>
      </div>
    </main>
  );
}
