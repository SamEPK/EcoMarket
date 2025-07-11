<template>
  <div class="about-page">

    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>À propos d'EcoMarket</h1>
          <p class="hero-subtitle">
            Notre mission : promouvoir une consommation responsable en soutenant
            les artisans locaux et les produits respectueux de l'environnement.
          </p>
        </div>
      </div>
    </section>

    <section class="story-section">
      <div class="container">
        <div class="story-content">
          <div class="story-text">
            <h2>Notre Histoire</h2>
            <p>
              Née d'une passion pour l'artisanat local et le respect de l'environnement,
              EcoMarket a été créée en 2023 par une équipe d'étudiants convaincus qu'il
              était possible de consommer autrement.
            </p>
            <p>
              Face à la standardisation des produits de grande distribution, nous avons
              souhaité créer une plateforme qui met en valeur les créateurs locaux et
              leurs savoir-faire traditionnels, tout en proposant des alternatives
              écologiques aux consommateurs soucieux de l'environnement.
            </p>
            <p>
              Aujourd'hui, EcoMarket rassemble plus de 50 artisans partenaires et propose
              une sélection rigoureuse de produits fabriqués dans le respect de
              l'environnement et des traditions artisanales.
            </p>
          </div>
          <div class="story-image">
            <img
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500"
              alt="Artisan au travail"
              class="story-img"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title">Nos Valeurs</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <Leaf :size="48" />
            </div>
            <h3>Écologie</h3>
            <p>
              Nous privilégions les produits fabriqués avec des matériaux naturels,
              recyclés ou recyclables. Chaque produit est sélectionné pour son
              impact environnemental réduit.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <Palette :size="48" />
            </div>
            <h3>Artisanat</h3>
            <p>
              Nous soutenons les artisans locaux en valorisant leur savoir-faire
              unique et leurs créations originales. Chaque produit raconte une histoire.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <Handshake :size="48" />
            </div>
            <h3>Équité</h3>
            <p>
              Nous garantissons une rémunération juste aux artisans et des conditions
              de travail respectueuses. Le commerce équitable est au cœur de nos priorités.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <Home :size="48" />
            </div>
            <h3>Local</h3>
            <p>
              Nous favorisons les circuits courts et les producteurs locaux pour
              réduire l'empreinte carbone et dynamiser l'économie de proximité.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="commitment-section">
      <div class="container">
        <div class="commitment-content">
          <div class="commitment-text">
            <h2>Notre Engagement Environnemental</h2>
            <div class="engagement-list">
              <div class="engagement-item">
                <span class="engagement-icon">
                  <Package :size="32" />
                </span>
                <div>
                  <h4>Emballages éco-responsables</h4>
                  <p>Tous nos emballages sont recyclables ou compostables</p>
                </div>
              </div>

              <div class="engagement-item">
                <span class="engagement-icon">
                  <Truck :size="32" />
                </span>
                <div>
                  <h4>Livraison neutre en carbone</h4>
                  <p>Compensation carbone pour toutes nos livraisons</p>
                </div>
              </div>

              <div class="engagement-item">
                <span class="engagement-icon">
                  <Recycle :size="32" />
                </span>
                <div>
                  <h4>Programme de recyclage</h4>
                  <p>Reprise et recyclage des emballages usagés</p>
                </div>
              </div>

              <div class="engagement-item">
                <span class="engagement-icon">
                  <TreePine :size="32" />
                </span>
                <div>
                  <h4>Reforestation</h4>
                  <p>1 arbre planté pour chaque commande passée</p>
                </div>
              </div>
            </div>
          </div>
          <div class="commitment-stats">
            <div class="stat-card">
              <div class="stat-number">50+</div>
              <div class="stat-label">Artisans partenaires</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">1000+</div>
              <div class="stat-label">Commandes livrées</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">500+</div>
              <div class="stat-label">Arbres plantés</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">95%</div>
              <div class="stat-label">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <h2 class="section-title">Notre Équipe</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <User :size="64" />
            </div>
            <h4>Samuel</h4>
            <p class="member-role">Développeur & Co-fondateur</p>
            <p class="member-description">
              Passionné de développement web et d'écologie, Samuel s'occupe
              de la partie technique de la plateforme et de l'architecture système.
            </p>
          </div>

          <div class="team-member">
            <div class="member-avatar">
              <User :size="64" />
            </div>
            <h4>Fouad</h4>
            <p class="member-role">Designer & Co-fondateur</p>
            <p class="member-description">
              Expert en UX/UI et passionné d'artisanat, Fouad conçoit
              l'expérience utilisateur et l'identité visuelle de notre plateforme.
            </p>
          </div>

          <div class="team-member">
            <div class="member-avatar">
              <User :size="64" />
            </div>
            <h4>Quentin</h4>
            <p class="member-role">Business & Co-fondateur</p>
            <p class="member-description">
              Spécialiste du développement commercial et des partenariats, Quentin
              s'occupe des relations avec nos artisans partenaires.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-content">
          <div class="contact-info">
            <h2>Contactez-nous</h2>
            <p>
              Vous avez des questions ? Vous souhaitez devenir partenaire ?
              N'hésitez pas à nous contacter !
            </p>

            <div class="contact-details">

              <div class="contact-item">
                <div>
                  <strong>Adresse</strong>
                  <p>123 Rue Verte<br>75001 Paris, France</p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <h3>Envoyez-nous un message</h3>
            <form @submit.prevent="sendMessage">
              <div class="form-group">
                <input
                  v-model="contactForm.name"
                  type="text"
                  placeholder="Votre nom"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <input
                  v-model="contactForm.email"
                  type="email"
                  placeholder="Votre email"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <input
                  v-model="contactForm.subject"
                  type="text"
                  placeholder="Sujet"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <textarea
                  v-model="contactForm.message"
                  placeholder="Votre message"
                  required
                  rows="5"
                  class="form-textarea"
                ></textarea>
              </div>

              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                {{ isSubmitting ? 'Envoi...' : 'Envoyer le message' }}
              </button>

              <p v-if="submitMessage" class="submit-message" :class="messageType">
                {{ submitMessage }}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Leaf, Palette, Handshake, Home, Package, Truck, Recycle, TreePine, User } from 'lucide-vue-next'
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const messageType = ref('')

// Méthode pour envoyer le message
async function sendMessage() {
  isSubmitting.value = true
  submitMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))

    submitMessage.value = 'Message envoyé avec succès ! Nous vous répondrons rapidement.'
    messageType.value = 'success'
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    submitMessage.value = 'Erreur lors de l\'envoi. Veuillez réessayer.'
    messageType.value = 'error'
  } finally {
    isSubmitting.value = false

    // Efface le message après 5 secondes
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--text-dark);
  margin-bottom: 3rem;
  font-weight: bold;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: #ffffff;
  padding: 4rem 0;
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 1.3rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: #ffffff;
  opacity: 0.95;
}

/* Notre Histoire */
.story-section {
  padding: 4rem 0;
  background: #ffffff;
}

.story-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.story-text h2 {
  font-size: 2rem;
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-weight: bold;
}

.story-text p {
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.story-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Nos Valeurs */
.values-section {
  padding: 4rem 0;
  background: var(--background-light);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-icon {
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
}

.value-card h3 {
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-weight: bold;
}

.value-card p {
  color: var(--text-light);
  line-height: 1.6;
}

/* Notre Engagement */
.commitment-section {
  padding: 4rem 0;
  background: #ffffff;
}

.commitment-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.commitment-text h2 {
  font-size: 2rem;
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-weight: bold;
}

.engagement-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.engagement-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.engagement-icon {
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.engagement-item h4 {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.engagement-item p {
  color: var(--text-light);
  line-height: 1.5;
  margin: 0;
}

.commitment-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-card {
  background: var(--background-light);
  padding: 2rem 1rem;
  border-radius: 12px;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Notre Équipe */
.team-section {
  padding: 4rem 0;
  background: var(--background-light);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.team-member {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.member-avatar {
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
}

.team-member h4 {
  font-size: 1.3rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.member-role {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-description {
  color: var(--text-light);
  line-height: 1.6;
  margin: 0;
}

/* Contact */
.contact-section {
  padding: 4rem 0;
  background: #ffffff;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info h2 {
  font-size: 2rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  font-weight: bold;
}

.contact-info > p {
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.contact-item strong {
  color: var(--text-dark);
  display: block;
  margin-bottom: 0.25rem;
}

.contact-item p {
  color: var(--text-light);
  margin: 0;
  line-height: 1.4;
}
.contact-form {
  background: var(--background-light);
  padding: 2rem;
  border-radius: 12px;
}

.contact-form h3 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: #ffffff;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  width: 100%;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-message {
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
}

.submit-message.success {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
}

.submit-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
}
@media (max-width: 968px) {
  .story-content,
  .commitment-content,
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .commitment-stats {
    order: -1;
  }

  .story-img {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .commitment-stats {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
