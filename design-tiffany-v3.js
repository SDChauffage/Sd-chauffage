/* S.D Chauffage — Design Tiffany V3

   Design ajouté à l'application existante.

   Les données et les fonctions de la V2 sont conservées.

*/

(function () {

  "use strict";

  // NOUVEAU DESIGN

  const style = document.createElement("style");

  style.textContent = `

    :root {

      --nav: #102b45;

      --nav2: #203e58;

      --accent: #2389e8;

      --bg: #f3f7fc;

      --text: #183048;

      --muted: #718395;

      --line: #e2eaf2;

      --shadow: 0 3px 13px #102b4510;

    }

    body {

      background: #eaf1f8;

    }

    .app {

      background: var(--bg);

    }

    .side {

      background: #102b45;

    }

    .brand {

      font-size: 24px;

    }

    .brand::before {

      content: "🔥 ";

      font-size: 27px;

    }

    .nav button.active::before {

      background: #38a3f5;

    }

    .main {

      width: 100%;

      max-width: 1600px;

    }

    .card {

      border-radius: 16px;

      box-shadow: var(--shadow);

    }

    .btn {

      border-radius: 11px;

    }

    .primary {

      background: #2389e8;

    }

    .gold {

      background: #efb923;

      color: #25394b;

    }

    .top h1 {

      color: #102b45;

    }

    .table th {

      background: #f7faff;

    }

    .table tbody tr:hover {

      background: #f8fbff;

    }

    .search input {

      border-radius: 12px;

    }

    .mobile {

      background: #ffffff;

      box-shadow: 0 -4px 20px #102b4512;

      border-top: 1px solid #e2eaf2;

    }

    .mobile button {

      color: #718395;

    }

    .mobile button.active {

      color: #2389e8;

      font-weight: 800;

    }

    .modalbox {

      border-radius: 18px;

    }

    .tiffany-hero {

      background: linear-gradient(140deg, #102b45, #254762);

      color: white;

      border-radius: 19px;

      padding: 22px;

      margin-bottom: 15px;

    }

    .tiffany-hero h2 {

      font-size: 25px;

      margin: 0 0 5px;

    }

    .tiffany-hero p {

      margin: 0;

      color: #d5e3ed;

      font-size: 13px;

    }

    .tiffany-date {

      margin-top: 12px;

      color: #dce8f1;

      font-size: 12px;

    }

    .tiffany-tiles {

      display: grid;

      grid-template-columns: repeat(4, minmax(0, 1fr));

      gap: 13px;

    }

    .tiffany-tile {

      border: 0;

      text-align: left;

      color: white;

      min-height: 155px;

      border-radius: 17px;

      padding: 18px;

      display: flex;

      flex-direction: column;

      align-items: flex-start;

      justify-content: space-between;

      box-shadow: 0 5px 14px #102b4514;

    }

    .tiffany-tile .ti {

      font-size: 29px;

    }

    .tiffany-tile strong {

      font-size: 17px;

    }

    .tiffany-tile small {

      font-size: 12px;

      line-height: 1.4;

      color: white;

    }

    .tiffany-tile.blue {

      background: #2489e9;

    }

    .tiffany-tile.teal {

      background: #319e89;

    }

    .tiffany-tile.orange {

      background: #ff902f;

    }

    .tiffany-tile.red {

      background: #d93f55;

    }

    .tiffany-tile.purple {

      background: #5953a7;

    }

    .tiffany-tile.yellow {

      background: #efb923;

    }

    .tiffany-tile.slate {

      background: #3a5065;

    }

    .tiffany-next {

      background: white;

      color: #183048;

      border: 1px solid #e2eaf2;

    }

    .tiffany-next small {

      color: #718395;

    }

    .tiffany-client {

      width: 100%;

      border: 1px solid #e2eaf2;

      border-radius: 15px;

      background: white;

      display: flex;

      align-items: center;

      gap: 12px;

      padding: 15px;

      text-align: left;

      margin: 10px 0;

      color: #183048;

    }

    .tiffany-avatar {

      width: 47px;

      height: 47px;

      flex: none;

      border-radius: 50%;

      background: #315b7e;

      color: white;

      display: grid;

      place-items: center;

      font-weight: 800;

    }

    .tiffany-client .grow {

      flex: 1;

      min-width: 0;

    }

    .tiffany-client b {

      display: block;

      font-size: 15px;

    }

    .tiffany-client small {

      display: block;

      color: #718395;

      font-size: 12px;

      margin-top: 4px;

    }

    .tiffany-client .arrow {

      color: #7c91a2;

      font-size: 25px;

    }

    @media (max-width: 950px) {

      .main {

        padding: 0 13px 105px;

      }

      .top {

        background: #102b45;

        color: white;

        margin: 0 -13px 15px;

        padding: calc(18px + env(safe-area-inset-top)) 18px 18px;

      }

      .top h1 {

        color: white;

        font-size: 21px;

      }

      .topright {

        color: #dce8f5;

      }

      .topright .btn {

        background: #284b66;

        color: white;

      }

      .tiffany-tiles {

        grid-template-columns: 1fr 1fr;

      }

      .tiffany-tile {

        min-height: 147px;

        padding: 16px 14px;

      }

      .mobile {

        padding: 10px 3px calc(10px + env(safe-area-inset-bottom));

      }

      .mobile button {

        min-width: 56px;

      }

      .mobile button b {

        font-size: 23px;

      }

      .card {

        padding: 15px;

      }

    }

    @media (max-width: 400px) {

      .tiffany-tile {

        min-height: 140px;

        padding: 13px 11px;

      }

      .tiffany-tile strong {

        font-size: 15px;

      }

      .tiffany-tile small {

        font-size: 11px;

      }

      .tiffany-hero h2 {

        font-size: 22px;

      }

    }

  `;

  document.head.appendChild(style);

  // On vérifie que l'application d'origine est bien présente.

  if (

    typeof db === "undefined" ||

    typeof go !== "function" ||

    typeof render !== "function"

  ) {

    console.warn("Design Tiffany : application S.D Chauffage introuvable.");

    return;

  }

  // NOUVEL ACCUEIL

  window.home = function () {

    const upcoming = [...db.events]

      .filter(e => e.date >= today() && e.status !== "Annulé")

      .sort((a, b) =>

        (a.date + a.time).localeCompare(b.date + b.time)

      );

    const next = upcoming[0];

    const due = db.maint.filter(

      m => m.next && m.next <= today()

    ).length;

    const name = esc(

      db.settings.user &&

      db.settings.user !== "Administrateur"

        ? db.settings.user

        : "Steve"

    );

    const date = new Intl.DateTimeFormat("fr-BE", {

      weekday: "long",

      day: "numeric",

      month: "long",

      year: "numeric"

    }).format(new Date());

    const tiles = [

      [

        "clients",

        "👤",

        "Clients",

        "Fiches clients et coordonnées",

        "blue"

      ],

      [

        "agenda",

        "📅",

        "Agenda",

        "Rendez-vous et déplacements",

        "teal"

      ],

      [

        "jobs",

        "🔧",

        "Interventions",

        "Dépannages et installations",

        "orange"

      ],

      [

        "docs",

        "📋",

        "Testo / Mesures",

        "Documents et rapports",

        "red"

      ],

      [

        "quotes",

        "📄",

        "Devis & Factures",

        "Devis et suivi des paiements",

        "purple"

      ],

      [

        "maint",

        "🛠️",

        "Entretiens",

        "Échéances et rappels",

        "yellow"

      ],

      [

        "settings",

        "⚙️",

        "Administration",

        "Entreprise et services",

        "slate"

      ]

    ];

    const tileHTML = tiles.map(

      ([destination, icon, title, description, color]) => `

        <button

          class="tiffany-tile ${color}"

          onclick="go('${destination}')"

        >

          <span class="ti">${icon}</span>

          <strong>${title} ›</strong>

          <small>${description}</small>

        </button>

      `

    ).join("");

    const nextHTML = next

      ? `

        ${esc(next.client || "Sans client")}<br>

        ${fmt(next.date)} · ${esc(next.time || "")}<br>

        ${esc(next.type || "")}

      `

      : "Aucun rendez-vous à venir";

    $("content").innerHTML = `

      <div class="tiffany-hero">

        <div style="

          font-weight: 850;

          font-size: 24px;

          margin-bottom: 16px;

        ">

          🔥 S.D

          <span style="

            font-size: 12px;

            letter-spacing: 2px;

          ">CHAUFFAGE</span>

        </div>

        <h2>Bonjour ${name} 👋</h2>

        <p>Prêt pour une nouvelle journée ?</p>

        <div class="tiffany-date">

          📅 ${esc(date)}<br>

          Chauffage • Sanitaire • Entretien • Dépannage

        </div>

      </div>

      <div class="tiffany-tiles">

        ${tileHTML}

        <button

          class="tiffany-tile tiffany-next"

          onclick="go('agenda')"

        >

          <span class="ti">📅</span>

          <strong>Prochain rendez-vous</strong>

          <small>${nextHTML}</small>

        </button>

      </div>

      <div class="section card">

        <div class="actions between">

          <b>À suivre</b>

          <button

            class="btn soft"

            onclick="go('reminders')"

          >

            Voir les rappels ›

          </button>

        </div>

        <div class="row">

          <span>Entretiens à prévoir</span>

          <b>${due}</b>

        </div>

        <div class="row">

          <span>Factures impayées</span>

          <b>${

            db.invoices.filter(

              i => i.status === "Impayée"

            ).length

          }</b>

        </div>

      </div>

    `;

  };

  // NOUVELLE PRÉSENTATION DES CLIENTS

  window.clients = function () {

    $("content").innerHTML = `

      <div class="card">

        <div class="actions between">

          <div class="search">

            <input

              id="cq"

              placeholder="Rechercher un client..."

              oninput="filterTiffanyClients(this.value)"

            >

          </div>

          <button

            class="btn primary"

            onclick="openClient()"

          >

            + Nouveau client

          </button>

        </div>

        <div

          id="tiffany-client-list"

          style="margin-top: 14px"

        ></div>

      </div>

    `;

    filterTiffanyClients("");

  };

  window.filterTiffanyClients = function (value) {

    const q = String(value || "").toLowerCase();

    const matches = db.clients

      .map((c, i) => ({ c, i }))

      .filter(({ c }) =>

        [

          c.name,

          c.phone,

          c.city,

          c.address,

          c.email

        ]

          .join(" ")

          .toLowerCase()

          .includes(q)

      );

    $("tiffany-client-list").innerHTML =

      matches.map(({ c, i }) => {

        const initials = (c.name || "?")

          .trim()

          .split(/\s+/)

          .slice(0, 2)

          .map(word => word[0])

          .join("")

          .toUpperCase();

        return `

          <button

            class="tiffany-client"

            onclick="openClient(${i})"

          >

            <span class="tiffany-avatar">

              ${esc(initials)}

            </span>

            <span class="grow">

              <b>${esc(c.name)}</b>

              <small>

                ${esc(c.address || "")}

                ${esc(c.zip || "")}

                ${esc(c.city || "")}

              </small>

              <small>

                Dernière intervention :

                ${fmt(c.last)}

              </small>

            </span>

            <span class="arrow">›</span>

          </button>

        `;

      }).join("") ||

      '<div class="empty">Aucun client trouvé.</div>';

  };

  // COULEUR DE L'ONGLET ACTIF EN BAS

  const originalDrawNav = window.drawNav;

  window.drawNav = function () {

    originalDrawNav();

    document.querySelectorAll("#mobile button")

      .forEach((button, i) => {

        button.classList.toggle(

          "active",

          nav[i] && nav[i][0] === page

        );

      });

  };

  // Si tu es déjà connecté, le design s'affiche immédiatement.

  if (sessionStorage.sd2 === "1") {

    drawNav();

    render();

  }

})();

