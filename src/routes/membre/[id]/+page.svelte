<script lang="ts">
  let { data } = $props();
  const date = (value: string | Date) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
</script>

<svelte:head><title>Ma carte · Maison Fidèle</title></svelte:head>

<section class="member-page shell">
  <div class="member-heading"><div><div class="eyebrow">Votre espace</div><h1>Bonjour {data.member.firstName}</h1><p>Votre fidélité vous accompagne partout.</p></div><div class="balance"><span>Solde actuel</span><strong>{data.member.points}</strong><small>points</small></div></div>

  <div class="member-grid">
    <article class="loyalty-card">
      <div class="card-top"><span class="brand-mark light">M</span><span>MAISON<br />FIDÈLE</span></div>
      <div class="card-points"><small>VOTRE SOLDE</small><strong>{data.member.points}</strong><span>points</span></div>
      <div class="card-bottom"><div><small>MEMBRE</small><b>{data.member.firstName} {data.member.lastName}</b></div><div><small>N° DE CARTE</small><b>{data.member.memberNumber}</b></div></div>
    </article>

    <article class="panel qr-panel">
      <h2>Votre QR code</h2><p>Présentez-le lors de votre passage.</p>
      <img src={data.qrCode} alt={`QR code du membre ${data.member.memberNumber}`} />
      <code>{data.member.memberNumber}</code>
    </article>
  </div>

  <section class="wallet-section">
    <h2>Ajoutez votre carte au téléphone</h2>
    <div class="wallet-buttons">
      {#if data.wallet.apple === 'configured'}<a class="wallet-button apple" href={`/api/wallet/apple/${data.member.id}`}> &nbsp; Ajouter à Apple Wallet</a>{:else}<button class="wallet-button apple" disabled> &nbsp; Apple Wallet · Mode développement</button>{/if}
      {#if data.wallet.google === 'configured'}<a class="wallet-button google" href={`/api/wallet/google/${data.member.id}`}>G &nbsp; Ajouter à Google Wallet</a>{:else}<button class="wallet-button google" disabled>G &nbsp; Google Wallet · Mode développement</button>{/if}
    </div>
    {#if data.wallet.apple === 'development' || data.wallet.google === 'development'}<p class="dev-note">Les boutons en mode développement seront activés dès que les credentials correspondants seront renseignés.</p>{/if}
  </section>

  <section class="history panel">
    <div class="section-title"><h2>Historique</h2><span>{data.transactions.length} mouvement{data.transactions.length > 1 ? 's' : ''}</span></div>
    {#if data.transactions.length}
      <div class="transaction-list">{#each data.transactions as transaction}<div class="transaction"><div><strong>{transaction.note}</strong><small>{date(transaction.createdAt)}</small></div><div class:positive={transaction.amount > 0} class:negative={transaction.amount < 0}>{transaction.amount > 0 ? '+' : ''}{transaction.amount} pts<small>Solde : {transaction.balanceAfter}</small></div></div>{/each}</div>
    {:else}<p class="empty">Aucun mouvement pour le moment.</p>{/if}
  </section>
</section>
