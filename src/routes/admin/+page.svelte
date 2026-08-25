<script lang="ts">
  let { data, form } = $props();
  const date = (value: string | Date) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  const pointValues = $derived((form?.pointValues ?? {}) as Record<string, string>);
  const pointErrors = $derived((form?.pointErrors ?? {}) as Record<string, string>);
</script>

<svelte:head><title>Administration · Maison Fidèle</title></svelte:head>

<section class="admin-page shell">
  <div class="eyebrow">Administration</div><h1>Gestion des membres</h1><p class="lead">Recherchez une personne, consultez son solde et enregistrez un mouvement.</p>

  <form class="search panel" method="GET">
    <label for="q">Rechercher un membre</label>
    <div><input id="q" name="q" value={data.query} placeholder="Nom, email ou numéro de membre" /><button class="button primary" type="submit">Rechercher</button></div>
  </form>

  <div class="admin-grid">
    <section class="panel results"><h2>Membres <span>{data.results.length}</span></h2>
      {#each data.results as member}<a class:active={data.selected?.id === member.id} href={`?q=${encodeURIComponent(data.query)}&member=${member.id}`}><span class="avatar">{member.firstName[0]}{member.lastName[0]}</span><span><strong>{member.firstName} {member.lastName}</strong><small>{member.email}<br />{member.memberNumber}</small></span><b>{member.points}<small> pts</small></b></a>{:else}<p class="empty">Aucun membre trouvé.</p>{/each}
    </section>

    <section class="panel member-admin">
      {#if data.selected}
        <div class="selected-header"><div><small>MEMBRE SÉLECTIONNÉ</small><h2>{data.selected.firstName} {data.selected.lastName}</h2><p>{data.selected.memberNumber}</p></div><strong>{form?.memberId === data.selected.id && form?.success ? form.balance : data.selected.points}<small> points</small></strong></div>
        {#if form?.success && form?.memberId === data.selected.id}<p class="success-message">Le solde a bien été mis à jour.</p>{/if}
        <form method="POST" action="?/points" class="form-stack compact">
          <input type="hidden" name="memberId" value={data.selected.id} />
          <div class="two-columns"><label>Points (+ ou −)<input type="number" name="amount" placeholder="Ex. 25 ou -10" required value={pointValues.memberId === data.selected.id ? pointValues.amount : ''} />{#if pointErrors.amount}<small class="error">{pointErrors.amount}</small>{/if}</label><label>Motif<input name="note" maxlength="120" placeholder="Ex. Achat en boutique" required value={pointValues.memberId === data.selected.id ? pointValues.note : ''} />{#if pointErrors.note}<small class="error">{pointErrors.note}</small>{/if}</label></div>
          <button class="button primary" type="submit">Enregistrer le mouvement</button>
        </form>
        <div class="mini-history"><h3>Derniers mouvements</h3>{#each data.transactions.slice(0, 8) as transaction}<div><span><strong>{transaction.note}</strong><small>{date(transaction.createdAt)}</small></span><b class:positive={transaction.amount > 0} class:negative={transaction.amount < 0}>{transaction.amount > 0 ? '+' : ''}{transaction.amount}</b></div>{:else}<p class="empty">Aucun mouvement.</p>{/each}</div>
      {:else}<div class="select-prompt"><span>⌕</span><h2>Sélectionnez un membre</h2><p>Ses informations et son historique apparaîtront ici.</p></div>{/if}
    </section>
  </div>
</section>
