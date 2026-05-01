const form = document.getElementById("wish-form");
const surpriseMeButton = document.getElementById("surprise-me");
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photo-preview");
const cardTitle = document.getElementById("card-title");
const generatedMessage = document.getElementById("generated-message");
const messageTone = document.getElementById("message-tone");
const messageRelation = document.getElementById("message-relation");
const cardSignature = document.getElementById("card-signature");
const copyMessageButton = document.getElementById("copy-message");
const shareMessageButton = document.getElementById("share-message");
const printCardButton = document.getElementById("print-card");
const statusMessage = document.getElementById("status-message");
const wishCard = document.getElementById("wish-card");

const defaults = {
  photo:
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80",
  recipientName: "Your Favorite Person",
  senderName: "Someone who adores you",
  relation: "Partner / Love",
  tone: "Romantic",
};

const relationLabels = {
  love: "Partner / Love",
  "best-friend": "Best Friend",
  crush: "Someone Special",
  wife: "Wife",
  husband: "Husband",
  fiance: "Fiance / Fiancee",
  friend: "Friend",
  family: "Family",
};

const introMap = {
  romantic: [
    "Happy Birthday to the one who turns every ordinary moment into something worth holding close.",
    "On your birthday, I just want to remind you how deeply loved, admired, and cherished you are.",
    "Happy Birthday to the heart that makes my world gentler, brighter, and more alive.",
  ],
  sweet: [
    "Happy Birthday to someone whose presence makes life feel softer and more beautiful.",
    "Today is for celebrating the warmth, kindness, and joy you bring so effortlessly.",
    "Happy Birthday to a soul who makes every memory feel golden.",
  ],
  deep: [
    "Happy Birthday to the rare kind of person whose presence leaves a mark on the heart.",
    "Some people pass through life quietly, but you change the meaning of it just by being here.",
    "Happy Birthday to the one whose existence makes love, time, and memory feel deeper.",
  ],
  playful: [
    "Happy Birthday to the one who looks adorable, acts unforgettable, and somehow gets even better every year.",
    "Another year older, somehow more charming, and still impossible not to think about.",
    "Happy Birthday to the main character of every fun memory worth repeating.",
  ],
  elegant: [
    "Happy Birthday to someone whose grace, warmth, and quiet beauty never go unnoticed.",
    "Some birthdays deserve more than simple words, and you are one of those reasons.",
    "Happy Birthday to a presence so refined that even memories of you feel luminous.",
  ],
};

const bridgeMap = {
  love: "Being close to you has made love feel real in the most beautiful way.",
  "best-friend": "You make laughter easier, hard days lighter, and memories more alive.",
  crush: "There is something about you that stays in the mind long after the moment ends.",
  wife: "Life beside you feels richer, calmer, and full of meaning.",
  husband: "With you, home is not a place, it is a feeling I get to live inside.",
  fiance: "Loving you and choosing a future with you feels like the easiest truth in my life.",
  friend: "You have a way of bringing comfort, joy, and honesty wherever you go.",
  family: "Your love has shaped more of my life than words can fully explain.",
};

const toneClosers = {
  romantic:
    "I hope this year returns every ounce of love you give and surrounds you with the tenderness you deserve.",
  sweet:
    "I hope your day feels warm, lovely, and full of the little moments that become cherished memories.",
  deep:
    "I hope the year ahead meets your heart with peace, meaning, and the kind of happiness that stays.",
  playful:
    "I hope this year spoils you properly, surprises you often, and gives you endless reasons to smile.",
  elegant:
    "May this new year of your life unfold with beauty, fulfillment, and quiet joy in every season.",
};

const sampleProfiles = [
  {
    recipientName: "Aarav",
    senderName: "Meera",
    relation: "love",
    tone: "romantic",
    traits: "gentle, loyal, unforgettable",
    memory: "That rainy evening when we kept talking for hours and forgot the rest of the world.",
    extra: "Mention how safe and seen I feel with him.",
  },
  {
    recipientName: "Sana",
    senderName: "Riya",
    relation: "best-friend",
    tone: "sweet",
    traits: "funny, caring, bright",
    memory: "Our birthday cafe plan that turned into a full day of laughing at everything.",
    extra: "Keep it affectionate and soft.",
  },
  {
    recipientName: "Kabir",
    senderName: "Anaya",
    relation: "crush",
    tone: "playful",
    traits: "smart, charming, impossible to ignore",
    memory: "The first time he smiled at me and I forgot what I was about to say.",
    extra: "Make it flirty but clean.",
  },
];

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTraits(rawTraits) {
  const items = rawTraits
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildMessage(data) {
  const introOptions = introMap[data.tone] || introMap.romantic;
  const intro = introOptions[data.recipientName.length % introOptions.length];
  const bridge = bridgeMap[data.relation] || bridgeMap.love;
  const closer = toneClosers[data.tone] || toneClosers.romantic;
  const traits = formatTraits(data.traits);

  const detailLines = [];

  if (traits) {
    detailLines.push(`You are ${traits}, and that combination is rare in the best possible way.`);
  }

  if (data.memory) {
    detailLines.push(`I still think about ${data.memory.trim().replace(/\.$/, "")}, and how naturally it became one of my favorite memories.`);
  }

  if (data.extra) {
    detailLines.push(data.extra.trim().replace(/\.$/, "") + ".");
  }

  return [intro, bridge, ...detailLines, closer].join(" ");
}

function updateCard(data) {
  cardTitle.textContent = `Happy Birthday, ${data.recipientName || defaults.recipientName}`;
  generatedMessage.textContent = buildMessage(data);
  messageTone.textContent = capitalize(data.tone || defaults.tone);
  messageRelation.textContent = relationLabels[data.relation] || defaults.relation;
  cardSignature.textContent = `With love, ${data.senderName || defaults.senderName}`;
}

function readFormData() {
  const formData = new FormData(form);
  return {
    recipientName: (formData.get("recipientName") || "").toString().trim(),
    senderName: (formData.get("senderName") || "").toString().trim(),
    relation: (formData.get("relation") || "love").toString(),
    tone: (formData.get("tone") || "romantic").toString(),
    traits: (formData.get("traits") || "").toString().trim(),
    memory: (formData.get("memory") || "").toString().trim(),
    extra: (formData.get("extra") || "").toString().trim(),
  };
}

function setStatus(message) {
  statusMessage.textContent = message;
}

async function saveSubmission(generatedWish) {
  const payload = new FormData(form);
  payload.append("generatedMessage", generatedWish);

  const response = await fetch("save_submission.php", {
    method: "POST",
    body: payload,
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.message || "Submission save failed.");
  }

  return result;
}

function refreshCardAnimation() {
  wishCard.classList.remove("is-refreshing");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      wishCard.classList.add("is-refreshing");
    });
  });
}

function setupRevealAnimations() {
  const revealTargets = [
    ".hero__copy",
    ".hero-card",
    ".feature-card",
    ".section-heading",
    ".form-panel",
    ".preview-panel",
    ".step",
  ];

  const nodes = document.querySelectorAll(revealTargets.join(", "));

  nodes.forEach((node, index) => {
    node.classList.add("reveal");
    node.dataset.delay = String(index % 4);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = readFormData();

  if (!data.recipientName) {
    setStatus("Enter the birthday person name first.");
    return;
  }

  updateCard(data);
  refreshCardAnimation();
  setStatus("Wish generated. Saving submission...");

  try {
    await saveSubmission(generatedMessage.textContent);
    setStatus("Wish generated and saved. You can now copy it, share it, or print the card.");
  } catch (error) {
    setStatus("Wish generated, but saving failed. Check the database setup before going live.");
  }
});

surpriseMeButton.addEventListener("click", () => {
  const profile = sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)];

  document.getElementById("recipientName").value = profile.recipientName;
  document.getElementById("senderName").value = profile.senderName;
  document.getElementById("relation").value = profile.relation;
  document.getElementById("tone").value = profile.tone;
  document.getElementById("traits").value = profile.traits;
  document.getElementById("memory").value = profile.memory;
  document.getElementById("extra").value = profile.extra;

  updateCard(profile);
  refreshCardAnimation();
  setStatus("Example content loaded. Replace it with your own details any time.");
});

photoInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    photoPreview.src = defaults.photo;
    setStatus("Photo removed. Using the default preview image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    photoPreview.src = reader.result;
    setStatus("Photo added to the birthday card preview.");
  };
  reader.readAsDataURL(file);
});

copyMessageButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generatedMessage.textContent);
    setStatus("Message copied to clipboard.");
  } catch (error) {
    setStatus("Clipboard copy failed on this device. Select and copy the message manually.");
  }
});

shareMessageButton.addEventListener("click", async () => {
  const shareData = {
    title: "Birthday Wish from Wish You.in",
    text: generatedMessage.textContent,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setStatus("Share sheet opened.");
      return;
    }

    await navigator.clipboard.writeText(generatedMessage.textContent);
    setStatus("Sharing is not supported here. The message was copied instead.");
  } catch (error) {
    setStatus("Share was cancelled or unavailable.");
  }
});

printCardButton.addEventListener("click", () => {
  window.print();
});

updateCard({
  recipientName: defaults.recipientName,
  senderName: defaults.senderName,
  relation: "love",
  tone: "romantic",
  traits: "gentle, radiant, unforgettable",
  memory: "the little moments that somehow became the most meaningful ones",
  extra: "You deserve a year that feels as beautiful as the love you bring into the world",
});

setupRevealAnimations();
