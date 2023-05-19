import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
    PromptTemplate,
  } from "langchain/prompts";
  import { LLMChain } from "langchain/chains";
import axios from 'axios'

  

const wiki = async (topic: string) => {
    try {
      const response = await axios.get(`https://api.wikimedia.org/core/v1/wikipedia/en/search/page`, {
        headers: {
          'User-Agent': 'YOUR_APP_NAME (YOUR_EMAIL_OR_CONTACT_PAGE)'
        },
        params: {
          q: topic,
          limit: 1
        }
      });
      const pageId = response.data.pages[0].id 
      const source = `http://en.wikipedia.org/?curid=${pageId}` 
      return { brief: response.data.pages[0].excerpt, source: source }
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to propagate it
    }
  };
  


export const langchainRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
        return {
            response: ' hey'
        }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  simpleGpt: publicProcedure
        .input(z.object({text: z.string()}))
        .mutation(async ({input}) => {
            const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
            const template = "answer this as concise as possible in 1 paragraph or preferably less: {product}?";
            const prompt = new PromptTemplate({
              template: template,
              inputVariables: ["product"],
            });
            const formattedprompt = await prompt.format({product: input.text})
            const res = await model.call(formattedprompt)
            
          return {
            response: res,
          };
        }),
    youtubeScriptWriterGPT: publicProcedure
    .input(z.object({text: z.string()})).
    mutation( async ({input}) => {
        //prompt tempaltes
        const prompt = PromptTemplate.fromTemplate(
            "write a youtube video title for {topic} "
          );
          const scriptPrompt = PromptTemplate.fromTemplate(
            "write a script for a youtube video named {topic}, this infomation can help: {wiki}, in your answer, remove any html tags present in {wiki}"
          )
        //memory

        //llms
        const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY})
        const titleChain = new LLMChain({llm: model, prompt: prompt})
         const scriptChain = new LLMChain({llm: model, prompt: scriptPrompt})
        //run
        const titleRes = await titleChain.call({ topic: input.text });

       
        
        const wikiWrapper = await wiki(input.text)
        const scriptRes = await scriptChain.call({ topic: input.text, wiki: wikiWrapper.brief });
        console.log(scriptRes);

 
        return {
            title: {titleRes},
            script: {scriptRes},
            source: wikiWrapper.source
        }
    })
});
