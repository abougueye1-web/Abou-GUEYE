import React from 'react';
import { motion } from 'motion/react';
import { Info, Target, Users, Award } from 'lucide-react';
import Translate from '../components/Translate';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            <Translate>À Propos de Canada Visa Program</Translate>
          </h1>
          <p className="text-lg text-slate-600">
            <Translate>Votre partenaire de confiance pour réaliser votre rêve canadien.</Translate>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              <Translate>Notre Mission</Translate>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Canada Visa Program s'engage à fournir des informations précises, à jour et accessibles à tous ceux qui souhaitent immigrer, travailler ou étudier au Canada. Nous simplifions les processus complexes pour vous aider à réussir votre transition.
              </Translate>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              <Translate>Notre Équipe</Translate>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Nous sommes une équipe de passionnés et d'experts en immigration, dédiés à l'accompagnement des nouveaux arrivants. Notre expertise couvre tous les aspects de la vie au Canada, des procédures administratives à l'intégration culturelle.
              </Translate>
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-600 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-6">
            <Translate>Pourquoi nous choisir ?</Translate>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-red-100"><Translate>Années d'Expérience</Translate></div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-red-100"><Translate>Utilisateurs Aidés</Translate></div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-red-100"><Translate>Informations Vérifiées</Translate></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
