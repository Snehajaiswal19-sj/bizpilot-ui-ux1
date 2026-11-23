
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Sparkles,
  Plus,
  Bot,
  UserRound,
  TrendingUp,
  Package,
  Wallet,
  ShoppingBag,
  Lightbulb,
  ChartNoAxesCombined,
  RotateCcw,
  MessageSquare,
  Clock3,
  Zap,
} from "lucide-react";
import "./AIAssistant.css";

const suggestions = [
  {
    icon: TrendingUp,
    title: "Analyse my sales",
    prompt: "How are my sales performing?",
  },
  {
    icon: Package,
    title: "Check my inventory",
    prompt: "Give me an inventory overview.",
  },
  {
    icon: Wallet,
    title: "Payment overview",
    prompt: "Summarise my payments.",
  },
  {
    icon: Lightbulb,
    title: "Business suggestions",
    prompt: "Give me some tips to improve my business.",
  },
];

const demoResponses = [
  {
    keywords: ["sales", "revenue", "earning", "performance"],
    title: "Here's your sales overview",
    text: "Based on the illustrative demo figures, your sales total is ₹3,23,300 for the selected 30-day period.",
    points: [
      "Sales are represented across four weekly periods.",
      "The fourth week has the highest sample sales value.",
      "Keep reviewing pending customer payments alongside sales.",
    ],
    tip: "Consider reviewing your best-selling products and planning stock around customer demand.",
  },
  {
    keywords: ["inventory", "stock", "product", "items"],
    title: "Inventory overview",
    text: "Here's a sample inventory review for your BizPilot demo workspace.",
    points: [
      "Monitor products with low available quantities.",
      "Review fast-moving items before placing new orders.",
      "Update stock records after every purchase and sale.",
    ],
    tip: "A regular stock review can help you avoid unexpected shortages.",
  },
  {
    keywords: ["payment", "cash", "received", "paid", "due", "pending"],
    title: "Payment summary",
    text: "Your illustrative payment records show ₹2,74,800 received and ₹1,48,500 paid in the selected 30-day sample period.",
    points: [
      "Sample net cash flow: ₹1,26,300.",
      "Keep received and made payments recorded separately.",
      "Review pending dues before following up with customers.",
    ],
    tip: "Record the payment method and reference wherever available to make reconciliation easier.",
  },
  {
    keywords: ["tip", "improve", "suggestion", "grow", "business", "advice"],
    title: "A few ideas for your business",
    text: "Here are some practical ideas you can consider for a small retail or wholesale business.",
    points: [
      "Review weekly sales to understand customer demand.",
      "Identify slow-moving stock and plan purchases carefully.",
      "Follow up on pending customer payments regularly.",
      "Keep supplier details and purchase records updated.",
    ],
    tip: "Start with one improvement at a time and review its impact after a few weeks.",
  },
];

const defaultResponse = {
  title: "Let's explore that",
  text: "I'm currently running in demo mode, so I can respond to a few sample business topics.",
  points: [
    "Try asking about sales performance.",
    "Ask for an inventory overview.",
    "Request a payment summary.",
    "Ask for practical business improvement ideas.",
  ],
  tip: "Choose one of the suggested prompts to explore the demo assistant.",
};

const createWelcomeMessage = () => ({
  id: 1,
  role: "assistant",
  type: "welcome",
  text: "Hello! I'm your BizPilot Assistant. I can help you explore your business information and discover useful insights.",
});

function getDemoResponse(message) {
  const normalised = message.toLowerCase();

  return (
    demoResponses.find((response) =>
      response.keywords.some((keyword) => normalised.includes(keyword))
    ) || defaultResponse
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState([createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const sendMessage = (text = input) => {
    const trimmed = text.trim();

    if (!trimmed || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    timerRef.current = setTimeout(() => {
      const response = getDemoResponse(trimmed);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "insight",
          ...response,
        },
      ]);

      setIsTyping(false);
    }, 1000);
  };

  const startNewChat = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessages([createWelcomeMessage()]);
    setInput("");
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <div>
          <span className="ai-eyebrow">YOUR BUSINESS COMPANION</span>
          <h1>AI Assistant</h1>
          <p>Ask questions, explore insights and plan your next move.</p>
        </div>

        <button className="ai-new-chat" onClick={startNewChat}>
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="ai-demo-banner">
        <span className="ai-demo-icon"><Sparkles size={16} /></span>
        <div>
          <strong>Demo Assistant</strong>
          <span>Responses are predefined examples, not live AI-generated advice.</span>
        </div>
        <span className="ai-demo-status">DEMO MODE</span>
      </div>

      <div className="ai-workspace">
        <aside className="ai-sidebar">
          <div className="ai-sidebar-title">
            <span>QUICK ACTIONS</span>
            <Zap size={15} />
          </div>

          <div className="ai-action-list">
            <button onClick={() => sendMessage("How are my sales performing?")}>
              <span className="ai-action-icon sage"><TrendingUp size={17} /></span>
              <span>
                <strong>Sales insights</strong>
                <small>Explore sales performance</small>
              </span>
            </button>

            <button onClick={() => sendMessage("Give me an inventory overview.")}>
              <span className="ai-action-icon amber"><Package size={17} /></span>
              <span>
                <strong>Inventory check</strong>
                <small>Review stock management</small>
              </span>
            </button>

            <button onClick={() => sendMessage("Summarise my payments.")}>
              <span className="ai-action-icon brown"><Wallet size={17} /></span>
              <span>
                <strong>Payment summary</strong>
                <small>Review payment activity</small>
              </span>
            </button>

            <button onClick={() => sendMessage("Give me some tips to improve my business.")}>
              <span className="ai-action-icon forest"><Lightbulb size={17} /></span>
              <span>
                <strong>Growth ideas</strong>
                <small>Explore practical suggestions</small>
              </span>
            </button>
          </div>

          <div className="ai-sidebar-bottom">
            <div className="ai-sidebar-bottom-icon">
              <ChartNoAxesCombined size={18} />
            </div>
            <strong>Make informed decisions</strong>
            <p>Use your business records to understand trends and plan ahead.</p>
          </div>
        </aside>

        <section className="ai-chat-panel">
          <div className="ai-chat-topbar">
            <div className="ai-chat-identity">
              <div className="ai-bot-avatar"><Sparkles size={18} /></div>
              <div>
                <strong>BizPilot Assistant</strong>
                <span><i /> Demo assistant available</span>
              </div>
            </div>

            <button
              className="ai-reset-button"
              onClick={startNewChat}
              title="Start a new chat"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((message) => (
              <div
                className={`ai-message-row ${message.role === "user" ? "user-message-row" : ""}`}
                key={message.id}
              >
                {message.role === "assistant" && (
                  <div className="ai-message-avatar">
                    <Bot size={17} />
                  </div>
                )}

                <div className={`ai-message-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}>
                  {message.role === "assistant" ? (
                    <>
                      {message.type === "welcome" ? (
                        <>
                          <p>{message.text}</p>
                          <div className="ai-welcome-caption">
                            <Sparkles size={13} />
                            What would you like to explore today?
                          </div>
                        </>
                      ) : (
                        <>
                          <h4>{message.title}</h4>
                          <p>{message.text}</p>

                          {message.points && (
                            <ul className="ai-response-points">
                              {message.points.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          )}

                          {message.tip && (
                            <div className="ai-tip-box">
                              <Lightbulb size={15} />
                              <div>
                                <strong>BizPilot suggestion</strong>
                                <p>{message.tip}</p>
                              </div>
                            </div>
                          )}
                          <span className="ai-response-label">
                            <Sparkles size={11} /> Sample response
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="ai-user-avatar">
                    <UserRound size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-row">
                <div className="ai-message-avatar"><Bot size={17} /></div>
                <div className="ai-typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="ai-suggestions">
              <span className="ai-suggestions-label">TRY ASKING</span>
              <div className="ai-suggestion-grid">
                {suggestions.map((suggestion) => {
                  const Icon = suggestion.icon;

                  return (
                    <button
                      key={suggestion.title}
                      onClick={() => sendMessage(suggestion.prompt)}
                    >
                      <Icon size={16} />
                      <span>{suggestion.title}</span>
                      <ArrowUp size={13} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="ai-chat-composer">
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything about your business..."
                disabled={isTyping}
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <ArrowUp size={19} />
              </button>
            </form>
            <div className="ai-composer-footer">
              <span><Clock3 size={12} /> Demo responses may not reflect live records.</span>
              <span>Powered by BizPilot Demo</span>
            </div>
          </div>
        </section>
      </div>

      <div className="ai-bottom-note">
        <MessageSquare size={15} />
        <span>This assistant is a frontend demonstration. It does not connect to a real AI service or access live business records.</span>
      </div>
    </div>
  );
}

export default AIAssistant;
