import React from "react";
import { Star, Quote, MessageSquare } from "lucide-react";
import Reveal from "./Reveal";

// TODO: Ganti dengan testimoni asli dari pelanggan Rekastaff.
const testimonials = [
  {
    quote:
      "Rekap absensi yang dulu makan waktu berhari-hari sekarang selesai otomatis. Validasi GPS dan selfie juga bikin data kehadiran jauh lebih bisa dipercaya.",
    name: "Ratna Dewi",
    role: "HR Manager",
    company: "Perusahaan Retail",
    initials: "RD",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    quote:
      "Proses payroll dengan PPh 21 dan BPJS yang biasanya bikin pusing tiap akhir bulan sekarang tinggal sekali klik. Slip gaji langsung terkirim ke semua karyawan.",
    name: "Andi Wijaya",
    role: "Finance & HR Lead",
    company: "Perusahaan Manufaktur",
    initials: "AW",
    color: "bg-green-500/10 text-green-600",
  },
  {
    quote:
      "Karyawan kami tersebar di beberapa kota, dan Rekastaff memudahkan semuanya — dari pengajuan cuti sampai pengaturan shift, semua transparan di satu aplikasi.",
    name: "Siti Rahma",
    role: "Operations Director",
    company: "Perusahaan Jasa",
    initials: "SR",
    color: "bg-purple-500/10 text-purple-600",
  },
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute bottom-0 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container px-4 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary sm:text-sm">
            <MessageSquare className="h-3.5 w-3.5" />
            Testimoni
          </span>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-default-900 md:text-5xl">
            Dipercaya Tim HR di{" "}
            <span className="text-primary">Berbagai Industri</span>
          </h2>
          <p className="text-base text-default-600 md:text-lg">
            Dari retail hingga manufaktur — lihat bagaimana Rekastaff membantu
            pekerjaan HR jadi lebih ringan setiap harinya.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.1}>
              <figure className="relative flex h-full flex-col rounded-3xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="flex-grow text-sm leading-relaxed text-default-600 md:text-base">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-6">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${testimonial.color}`}
                  >
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-default-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-default-500">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
