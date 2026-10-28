import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { contactReasons } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt — Trandareds IF" },
      {
        name: "description",
        content:
          "Kontakta Trandareds IF. Vill du bli medlem, sponsor eller bara prata fotboll? Hör av dig!",
      },
      { property: "og:title", content: "Kontakt — Trandareds IF" },
      { property: "og:description", content: "Kontakta Trandareds IF i Borås." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [formData, setFormData] = useState({
    reason: "sponsor" as (typeof contactReasons)[number],
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonLabel = {
      sponsor: "Sponsorfråga",
      bollekis: "Bollekis",
      other: "Annat/Övrigt",
    }[formData.reason];
    const subject = formData.subject;
    const body = `Kontaktanledning: ${reasonLabel}\n\n${formData.message}`;
    const mailto = `mailto:trandaredsif@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus("opened");
    window.location.href = mailto;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient">Kontakta oss</h1>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Vill du bli en del av vår resa? Vi är en klubb med hjärta, driv och gemenskap. Fyll i
              formuläret nedan så hör vi av oss så snart vi kan!
            </p>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-4 mb-10"
          >
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-display tracking-widest">
                  E-post
                </p>
                <a
                  href="mailto:Trandaredsif@outlook.com"
                  className="text-sm text-foreground hover:text-primary transition-colors"
                >
                  Trandaredsif@outlook.com
                </a>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-display tracking-widest">
                  Plats
                </p>
                <p className="text-sm text-foreground">Borås, Sverige</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-6 space-y-5"
          >
            <div>
              <label className="text-sm text-muted-foreground font-display tracking-wider uppercase block mb-2">
                Kontaktanledning
              </label>
              <div className="flex gap-4">
                {[
                  { value: "sponsor", label: "Sponsorfråga" },
                  { value: "bollekis", label: "Bollekis" },
                  { value: "other", label: "Annat/Övrigt" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        reason: opt.value as (typeof contactReasons)[number],
                      })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-display tracking-wider transition-colors ${
                      formData.reason === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground font-display tracking-wider uppercase block mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground font-display tracking-wider uppercase block mb-2">
                Rubrik
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Rubrik"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground font-display tracking-wider uppercase block mb-2">
                Meddelande
              </label>
              <textarea
                required
                rows={4}
                maxLength={5000}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Skriv din fråga eller ditt meddelande här."
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {status === "opened" && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground"
              >
                <CheckCircle size={16} />
                E-postprogrammet öppnas med meddelandet ifyllt. Skicka det därifrån.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gold-gradient font-display text-sm font-bold tracking-widest uppercase px-8 py-3 rounded-lg text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              Skicka via e-postprogram
            </button>
          </motion.form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
