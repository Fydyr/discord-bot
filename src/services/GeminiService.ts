import { GoogleGenerativeAI } from "@google/generative-ai";
import { LoggerService } from "./LoggerService";

export class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null;

  private static initialize() {
    if (!this.genAI && process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  private static async listAvailableModels() {
    try {
      if (!this.genAI) return;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
      );
      const data: any = await response.json();
      await LoggerService.info(`Modèles disponibles: ${data.models?.map((m: any) => m.name).join(", ")}`);
    } catch (error) {
      await LoggerService.error(`Erreur lors de la récupération des modèles: ${error}`);
    }
  }

  /**
   * Génère une anecdote informatique intéressante via Gemini
   */
  public static async generateTechAnecdote(): Promise<{ title: string; paragraphs: string[]; sources: { name: string; url: string }[] } | null> {
    try {
      this.initialize();

      if (!this.genAI) {
        await LoggerService.warning("GEMINI_API_KEY non configurée");
        return null;
      }

      // Liste des modèles pour debug
      // await this.listAvailableModels();

      // Utiliser gemini-2.5-flash qui a un meilleur quota gratuit
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Génère une anecdote fascinante et peu connue sur l'informatique, la technologie ou l'histoire du numérique.

Critères :
- L'anecdote doit être vraie et vérifiable
- Elle doit être intéressante et surprenante
- Évite les faits trop connus (comme "Bill Gates a créé Microsoft")
- VARIE les sujets pour ne pas parler toujours de la même chose

Sujets suggérés (choisis-en un au hasard, varie les thèmes) :
- Histoire de l'informatique et anecdotes historiques fascinantes
- Bugs célèbres et leurs conséquences inattendues
- Innovations qui ont changé le monde
- Personnalités tech méconnues et leurs contributions
- Langages de programmation et leurs origines surprenantes
- Jeux vidéo cultes et leur développement
- Valve et Steam (histoire, Steam Deck, Half-Life, Portal, Counter-Strike, etc.)
- Internet et le Web (premières pages, protocoles, culture internet)
- Matériel informatique (processeurs, mémoire, stockage)
- Systèmes d'exploitation et leur évolution
- Cryptographie et sécurité informatique
- Grandes entreprises tech et leur histoire
- Open source et logiciels libres
- Compétitions de programmation et hackatons
- Easter eggs et secrets cachés dans les logiciels
- Événements marquants de l'industrie tech

Tu peux aussi parler occasionnellement de sujets récents (2023-2025) mais sans en faire une priorité :
- Actualité technologique récente si elle est vraiment marquante
- Nouvelles innovations significatives

Format de réponse (très important, respecte exactement ce format JSON) :
{
  "title": "Un titre accrocheur pour l'anecdote (sans emoji)",
  "paragraphs": [
    "Premier paragraphe de l'anecdote (2-3 phrases)",
    "Deuxième paragraphe avec plus de détails (2-3 phrases)",
    "Troisième paragraphe avec la conclusion ou l'impact (2-3 phrases)"
  ],
  "sources": [
    {
      "name": "Nom de la source (ex: Wikipedia, site officiel, article, etc.)",
      "url": "URL complète de la source vérifiable"
    }
  ]
}

IMPORTANT : Fournis toujours au moins une source vérifiable avec une URL réelle où l'utilisateur peut vérifier l'anecdote.

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parser la réponse JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        await LoggerService.error(`Gemini n'a pas retourné de JSON valide: ${text.substring(0, 200)}`);
        return null;
      }

      const anecdote = JSON.parse(jsonMatch[0]);

      if (!anecdote.title || !anecdote.paragraphs || anecdote.paragraphs.length < 3) {
        await LoggerService.error(`Format de réponse Gemini invalide: ${JSON.stringify(anecdote)}`);
        return null;
      }

      // Si Gemini n'a pas fourni de sources, ajouter une source par défaut
      if (!anecdote.sources || anecdote.sources.length === 0) {
        anecdote.sources = [
          {
            name: "Généré par IA (Gemini)",
            url: "https://ai.google.dev/gemini-api"
          }
        ];
      }

      return anecdote;
    } catch (error) {
      await LoggerService.error(`Erreur lors de la génération avec Gemini: ${error}`);
      return null;
    }
  }
}
