/* =========================================================
   PromptArcade — Application Bootstrap
   ========================================================= */
(() => {
  // Listen to hash changes for routing
  window.addEventListener("hashchange", PA.render);

  // Initialize UI components and render initial route
  PA.renderCredits();
  PA.renderAuth();
  PA.render();

  // Run initial splash screen & onboarding check
  PA.boot();
})();
