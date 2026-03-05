import React from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, Database, UserCheck } from 'lucide-react';
import Translate from '../components/Translate';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            <Translate>Politique de Confidentialité</Translate>
          </h1>
          <p className="text-lg text-slate-600">
            <Translate>Dernière mise à jour : 5 mars 2026</Translate>
          </p>
        </motion.div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-12">
          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>1. Collecte des Données</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Nous collectons des informations lorsque vous vous inscrivez sur notre site, vous connectez à votre compte, faites un achat, entrez dans un concours, et/ou lorsque vous vous déconnectez. Les informations collectées incluent votre nom, votre adresse e-mail, votre numéro de téléphone, et/ou votre carte de crédit.
              </Translate>
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Eye size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>2. Utilisation des Informations</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour : personnaliser votre expérience, améliorer notre site Web, améliorer le service client, vous contacter par e-mail, administrer un concours, une promotion, ou une enquête.
              </Translate>
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Database size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>3. Protection des Informations</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
              </Translate>
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900"><Translate>4. Consentement</Translate></h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <Translate>
                En utilisant notre site, vous consentez à notre politique de confidentialité.
              </Translate>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
