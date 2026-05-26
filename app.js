// Dynamic Publications Fetcher Engine for Dr. Michael O. Oni
document.addEventListener("DOMContentLoaded", function() {
    
    // REPLACE this with your actual OpenAlex Author ID when ready.
    // Temporary test query targets your published co-authors/fields to populate the initial load
    const openAlexAuthorId = "A5036100522"; // Example system ID
    const fallbackQuery = "https://api.openalex.org/works?filter=author.id:" + openAlexAuthorId + "&sort=publication_year:desc";

    const feedContainer = document.getElementById("publications-feed");

    fetch(fallbackQuery)
        .then(response => {
            if (!response.ok) throw new Error("Network latency detected");
            return response.json();
        })
        .then(data => {
            const works = data.results;
            if (!works || works.length === 0) {
                renderEmptyState();
                return;
            }
            
            // Clear out loading animation text safely
            feedContainer.innerHTML = "";
            
            // Build modern layout row items dynamically
            works.forEach(work => {
                const title = work.title || "Untitled Research Work";
                const venue = work.primary_location?.source?.display_name || "International Scientific Journal";
                const year = work.publication_year || "Recent";
                const doi = work.doi || "#";
                
                // Truncate/clean up author strings cleanly
                const authorsArray = work.authorships ? work.authorships.slice(0, 5).map(a => a.author.display_name) : [];
                let authorsString = authorsArray.join(", ");
                if (work.authorships && work.authorships.length > 5) authorsString += " et al.";

                const itemHTML = `
                    <div class="bg-white p-6 rounded-xl shadow-xs border border-slate-100 hover:border-blue-400 transition flex flex-col justify-between relative overflow-hidden group">
                        <div>
                            <div class="flex justify-between items-start gap-4 mb-2">
                                <h3 class="font-bold text-base text-[#002244] group-hover:text-[#0066CC] transition leading-snug">${title}</h3>
                                <span class="text-xs font-black px-2.5 py-1 bg-slate-100 rounded text-slate-600">${year}</span>
                            </div>
                            <p class="text-xs text-slate-400 font-medium mb-3"><i class="fa-solid fa-user-group mr-1.5"></i>${authorsString}</p>
                            <p class="text-xs text-slate-500 font-semibold italic flex items-center">
                                <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>${venue}
                            </p>
                        </div>
                        ${doi !== "#" ? `
                        <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end">
                            <a href="${doi}" target="_blank" class="text-xs text-[#0066CC] hover:text-[#002244] font-bold tracking-wider uppercase flex items-center gap-1">
                                View Publisher DOI <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </a>
                        </div>` : ''}
                    </div>
                `;
                feedContainer.innerHTML += itemHTML;
            });
        })
        .catch(error => {
            console.error("Pipeline failure:", error);
            renderEmptyState();
        });

    function renderEmptyState() {
        feedContainer.innerHTML = `
            <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-xs text-center py-8">
                <p class="text-sm text-slate-500 font-medium">Database connection timed out. Please refresh or look up current updates on ResearchGate.</p>
            </div>
        `;
    }
});
