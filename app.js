// Verified Academic Production Pipeline for Dr. Michael O. Oni
document.addEventListener("DOMContentLoaded", function() {
    
    // Direct OpenAlex Author ID linking ORCID: 0000-0002-0272-4825 & WoS: X-7347-2019
    const authorId = "A5036100522"; 
    const apiUrl = `https://api.openalex.org/works?filter=author.id:${authorId}&sort=publication_year:desc`;

    const feedContainer = document.getElementById("publications-feed");
    const profileImg = document.getElementById("profile-pic");
    const profileIcon = document.getElementById("profile-icon");

    // 📸 Step 1: Manage Profile Picture Visibility
    // Checks if 'profile.png' exists in your root folder. 
    // If yes, it displays it. If no, it drops back safely to the fallback layout icon.
    const localImageSrc = "profile.png";
    const testerImage = new Image();
    testerImage.src = localImageSrc;
    
    testerImage.onload = function() {
        profileImg.src = localImageSrc;
        profileImg.classList.remove("hidden");
        profileIcon.classList.add("hidden");
    };
    testerImage.onerror = function() {
        // Alternative: Try loading a standard .jpg copy if png is missing
        const fallbackJpg = "profile.jpg";
        const testerJpg = new Image();
        testerJpg.src = fallbackJpg;
        testerJpg.onload = function() {
            profileImg.src = fallbackJpg;
            profileImg.classList.remove("hidden");
            profileIcon.classList.add("hidden");
        };
    };

    // 📚 Step 2: Fetch Live, Aggregated Open-Access Academic Records
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Metadata pipeline latency");
            return response.json();
        })
        .then(data => {
            const works = data.results;
            if (!works || works.length === 0) {
                renderEmptyState();
                return;
            }
            
            // Wipe out loading spinners safely
            feedContainer.innerHTML = "";
            
            // Loop through articles chronologically
            works.forEach(work => {
                const title = work.title || "Untitled Mathematical Formulation";
                const venue = work.primary_location?.source?.display_name || "International Scientific Journal";
                const year = work.publication_year || "Recent";
                const doi = work.doi || "#";
                
                // Format author array
                const authorsArray = work.authorships ? work.authorships.slice(0, 4).map(a => a.author.display_name) : [];
                let authorsString = authorsArray.join(", ");
                if (work.authorships && work.authorships.length > 4) authorsString += " et al.";

                const recordCard = `
                    <div class="bg-white p-6 rounded-xl shadow-xs border border-slate-100 hover:border-blue-500 transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div>
                            <div class="flex justify-between items-start gap-4 mb-2">
                                <h3 class="font-bold text-base text-[#002244] group-hover:text-[#0066CC] transition-colors leading-snug">${title}</h3>
                                <span class="text-xs font-black px-2.5 py-1 bg-slate-100 rounded text-slate-600">${year}</span>
                            </div>
                            <p class="text-xs text-slate-400 font-medium mb-3"><i class="fa-solid fa-user-group mr-1.5"></i>${authorsString}</p>
                            <p class="text-xs text-slate-500 font-semibold italic flex items-center">
                                <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>${venue}
                            </p>
                        </div>
                        ${doi !== "#" ? `
                        <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end">
                            <a href="${doi}" target="_blank" class="text-xs text-[#0066CC] hover:text-[#002244] font-bold tracking-wider uppercase flex items-center gap-1 transition-colors">
                                Source DOI Link <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </a>
                        </div>` : ''}
                    </div>
                `;
                feedContainer.innerHTML += recordCard;
            });
        })
        .catch(error => {
            console.error("Pipeline Error:", error);
            renderEmptyState();
        });

    function renderEmptyState() {
        feedContainer.innerHTML = `
            <div class="bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-500 text-sm">
                <i class="fa-solid fa-circle-exclamation text-amber-500 text-xl mb-2"></i>
                <p>Unable to sync live ORCID stream. Please verify your profile connections or view listings directly via Web of Science.</p>
            </div>
        `;
    }
});
