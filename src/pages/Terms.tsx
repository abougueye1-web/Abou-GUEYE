import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, Scale, AlertCircle } from 'lucide-react';
import Translate from '../components/Translate';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            <Translate>Conditions d'Utilisation</Translate>
          </h1>
          <p className="text-lg text-slate-600">
            <Translate>Dernière mise à jour : 5 mars 2026</Translate>
          </p>
        </motion.div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-12">
          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>1. Acceptation des Conditions</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                En accédant et en utilisant le site canadavisaprogram.com, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
              </Translate>
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>2. Nature des Informations</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Les informations fournies sur ce site sont à titre informatif uniquement. Bien que nous nous efforcions de maintenir les informations à jour, Canada Visa Program n'est pas un représentant officiel du gouvernement du Canada. Pour des conseils juridiques officiels, veuillez consulter le site officiel d'IRCC ou un consultant en immigration agréé.
              </Translate>
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Scale size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>3. Propriété Intellectuelle</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Tout le contenu présent sur ce site, y compris les textes, graphiques, logos et images, est la propriété de Canada Visa Program et est protégé par les lois sur le droit d'auteur. Toute reproduction non autorisée est strictement interdite.
              </Translate>
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>4. Limitation de Responsabilité</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Canada Visa Program ne pourra être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
              </Translate>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
