<script lang="ts">
  let { form } = $props();
  const values = $derived((form?.values ?? {}) as Record<string, string>);
  const errors = $derived((form?.errors ?? {}) as Record<string, string>);
</script>

<svelte:head><title>Créer ma carte · Maison Fidèle</title></svelte:head>

<section class="form-page shell narrow">
  <div class="eyebrow">Bienvenue chez nous</div>
  <h1>Créez votre carte</h1>
  <p class="lead">Inscrivez-vous en quelques secondes. Votre carte digitale sera immédiatement disponible.</p>

  <form method="POST" class="panel form-stack">
    <div class="two-columns">
      <label>Prénom<input name="firstName" autocomplete="given-name" value={values.firstName ?? ''} required minlength="2" />{#if errors.firstName}<small class="error">{errors.firstName}</small>{/if}</label>
      <label>Nom<input name="lastName" autocomplete="family-name" value={values.lastName ?? ''} required minlength="2" />{#if errors.lastName}<small class="error">{errors.lastName}</small>{/if}</label>
    </div>
    <label>Adresse email<input name="email" type="email" autocomplete="email" value={values.email ?? ''} required />{#if errors.email}<small class="error">{errors.email}</small>{/if}</label>
    <button class="button primary full" type="submit">Créer ma carte de fidélité</button>
    <small class="privacy">Vos informations servent uniquement à gérer votre programme de fidélité.</small>
  </form>
</section>
