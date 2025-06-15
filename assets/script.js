document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const categoryInput = document.getElementById('categoryInput');
  const bookList = document.getElementById('bookList');
  const bookDescription = document.getElementById('bookDescription');

  // Quando clicco su "Cerca libri"
  searchBtn.addEventListener('click', async () => {
    const category = categoryInput.value.trim().toLowerCase();
    bookList.innerHTML = '';
    bookDescription.innerHTML = '';

    if (!category) {
      alert('Per favore inserisci una categoria!');
      return;
    }

    const url = `https://openlibrary.org/subjects/${category}.json`;

    try {
      const response = await axios.get(url);
      const works = response.data.works;

      if (works.length === 0) {
        bookList.innerHTML = '<li>Nessun libro trovato.</li>';
        return;
      }

      works.forEach(work => {
        const li = document.createElement('li');
        li.textContent = `${work.title} — ${work.authors.map(a => a.name).join(', ')}`;
        li.dataset.key = work.key; // es. "/works/OL8193508W"
        bookList.appendChild(li);
      });

    } catch (error) {
      console.error('Errore nel recupero dei dati:', error);
      bookList.innerHTML = '<li>Errore durante la ricerca. Prova un\'altra categoria.</li>';
    }
  });

  // Quando clicco su un libro nella lista
  bookList.addEventListener('click', async (event) => {
    const li = event.target.closest('li');
    if (!li || !li.dataset.key) return;

    const workKey = li.dataset.key;
    const url = `https://openlibrary.org${workKey}.json`;

    bookDescription.innerHTML = 'Caricamento descrizione...';

    try {
      const response = await axios.get(url);
      const description = response.data.description;
      const text = typeof description === 'string'
        ? description
        : description?.value || 'Nessuna descrizione disponibile.';

      bookDescription.innerHTML = `
        <h2>Descrizione</h2>
        <p>${text}</p>
      `;
    } catch (error) {
      console.error('Errore nella descrizione:', error);
      bookDescription.innerHTML = '<p>Errore nel recupero della descrizione.</p>';
    }
  });
});
