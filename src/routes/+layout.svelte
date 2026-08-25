<script lang="ts">
  import '../styles.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Maison Fidèle</title>
  <meta name="description" content="Votre carte de fidélité, toujours avec vous." />
</svelte:head>

<header class="site-header">
  <a class="brand" href="/" aria-label="Maison Fidèle, accueil">
    <span class="brand-mark">M</span>
    <span>Maison Fidèle</span>
  </a>
  <nav aria-label="Navigation principale">
    <a href="/inscription">S'inscrire</a>
    <a href="/admin">Administration</a>
  </nav>
</header>

<main>{@render children()}</main>

<footer>Maison Fidèle · Carte digitale Apple Wallet & Google Wallet</footer>
