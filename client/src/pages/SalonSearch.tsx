import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SalonSearch() {
  // TODO: réutiliser tes vraies données ici (results/searchResults/salons…)
  // On met un tableau vide pour rétablir la compilation sans toucher au reste.
  const items: any[] = [];

  return (
    <main className="p-6">
      {/* Place ici tes blocs existants: barre de recherche, filtres, etc. */}

      {/* Résultats de recherche */}
      <section className="mt-6">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Aucun résultat.</p>
          ) : (
            items.map((item, idx) => (
              <motion.div
                key={item?.id ?? item?.slug ?? idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                layout
                className="mb-4"
              >
                {/* Remplace par ton vrai composant: <SalonCard data={item} /> */}
                <div className="rounded-xl border p-4">
                  <h3 className="font-medium">{item?.name ?? "Salon"}</h3>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}