const builder = require("botbuilder");
const express = require("express");
const fs = require("fs");
const { Recognizer } = require("node-nlp");

// Creates a connector for the chatbot
const connector = new builder.ChatConnector({
  appId: process.env.BOT_APP_ID,
  appPassword: process.env.BOT_APP_PASSWORD,
});

// Creates a node-nlp recognizer for the bot
const modelName = "./model.nlp";
const excelName = "./model.xls";

const recognizer = new Recognizer();
if (fs.existsSync(modelName)) {
  recognizer.load(modelName);
} else {
  recognizer.loadExcel(excelName);
  recognizer.save(modelName);
}


const bot = new builder.UniversalBot(connector, (session) => {
  session.send(
    `You reached the default message handler. You said '${session.message.text}'.`
  );
}).set("storage", new builder.MemoryBotStorage());

bot.recognizer(recognizer);

bot
  .dialog("GreetingDialog", (session) => {
    let resp = "";
    let googleNewsAPI = require("google-news-json");
    googleNewsAPI.getNews(
      googleNewsAPI.SEARCH,
      session.message.text,
      "en-GB",
      (err, response) => {
        for (i = 0; i < 5; i++) {
          resp =  resp + response["items"][i]["title"] + "\n\n\n";

        }
        session.send(resp);
      }
    );

    // session.send(aa);
    session.endDialog();
  })
  .triggerAction({ matches: "user.google" });

bot
  .dialog("HelpDialog", (session) => {
    session.send(
      `You reached the Help intent. You said '${session.message.text}'.`
    );
    session.endDialog();
  })
  .triggerAction({ matches: "Help" });

bot
  .dialog("CancelDialog", (session) => {
    session.send(
      "You reached the Cancel intent. You said '%s'.",
      session.message.text
    );
    session.endDialog();
  })
  .triggerAction({ matches: "Cancel" });

bot
  .dialog("SearchDialog", (session) => {
    session.endDialog();
  })
  .triggerAction({ matches: "Search" });

// Creates the express application
const app = express();
const port = process.env.PORT || 3000;
app.post("/api/messages", connector.listen());
app.listen(port);
console.log(`Chatbot listening on port ${port}`);
