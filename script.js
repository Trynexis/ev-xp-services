const webhookURL = "https://discord.com/api/webhooks/1167761368150200320/w-DXIgjyRUskpUmhnxTTI4VI7AGzvKtLAz6TX2gWPLbSuyuwjBmbUn16BOYuW1sfPrLU"; // your webhook URL

// Clone forms when 'number' is entered
document.getElementById('number').addEventListener('input', function () {
  const count = parseInt(this.value) || 0;
  const container = document.getElementById('pokemonFormsContainer');
  const template = document.getElementById('pokemonFormTemplate').content;

  container.innerHTML = '';  // clear any old entries

  // Create new forms for each Pokémon
  for (let i = 0; i < count; i++) {
    const block = template.cloneNode(true);
    const title = block.querySelector('h3');
    title.textContent = `Pokémon ${i + 1}`;
    container.appendChild(block);
  }
});

// Submit the form
document.getElementById('submitForm').addEventListener('click', async function (e) {
  const blocks = document.querySelectorAll('.pokemonFormBlock');
  if (blocks.length === 0) {
    return alert("Please enter how many Pokémon.");
  }

  const embeds = [];
  // For each block, create an embed
  blocks.forEach(block => {
    const mon     = block.querySelector('[name=mon]').value.trim();
    const levelno = block.querySelector('[name=levelno]').value.trim();
    const evolve  = block.querySelector('[name=evolve]').value;
    const ev      = block.querySelector('[name=ev]').value.trim() || "None";
    const IGN     = block.querySelector('[name=IGN]').value.trim();
    const extra   = block.querySelector('[name=extra]').value.trim() || "None";

    embeds.push({
      title: `📬 New Request: ${mon}`,
      color: 0x00ff99,
      fields: [
        { name: "1) Pokémon",     value: mon },
        { name: "2) Level Plan",  value: levelno },
        { name: "3) Evolve?",     value: evolve },
        { name: "4) EV Training", value: ev },
        { name: "5) IGN",         value: IGN },
        { name: "6) Extra Info",  value: extra }
      ],
      footer: { text: "Trynexis' EV & XP Services" },
      timestamp: new Date().toISOString()
    });
  });

  // Send the embeds as a single request
  const payload = {
    username: "Order manager",
    embeds: embeds
  };

  try {
    const res = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      document.getElementById('successMessage').style.display = 'block';
      document.getElementById('Pokeform').reset();
      document.getElementById('pokemonFormsContainer').innerHTML = '';
    } else {
      console.error("Failed to send webhook:", await res.text());
      alert("Failed to send form.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Network error. Please try again.");
  }
});
