document.addEventListener("DOMContentLoaded", function() {
    var headerContent = `
    <header>
        <div class="Navigation">
            <a href="/" style="text-decoration: none;">
                <p>Accueil</p>
            </a>
            <a href="/creer_repas" style="text-decoration: none;">
                <p>Créer Repas</p>
            </a>
            <a href="/editer_repas" style="text-decoration: none;">
                <p>Éditer Repas</p>
            </a>
            <a href="/comparer_repas" style="text-decoration: none;">
                <p>Comparer Repas</p>
            </a>
            <a href="/user_repas" style="text-decoration: none;">
                <p>Repas utilisateur</p>
            </a>

        </div>
    </header>`;
    
    document.body.insertAdjacentHTML("afterbegin", headerContent);
});

document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('header');
    let previousScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener("scroll", function() {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollPosition > 0) {
            // La page est en train de défiler vers le bas
            header.classList.add("scroll-down");
        }
        else{
            header.classList.remove("scroll-down");
        }

        previousScrollPosition = currentScrollPosition;
    });
});
