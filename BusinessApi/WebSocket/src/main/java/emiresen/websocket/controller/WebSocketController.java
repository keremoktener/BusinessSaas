package emiresen.websocket.controller;

import emiresen.websocket.document.Greeting;
import emiresen.websocket.document.HelloMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class WebSocketController {
    
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
//        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.name()) + "!");
    }

    @MessageMapping("/goodbye")
    @SendTo("/topic/farewells")
    public Greeting handleFarewell(HelloMessage message) throws Exception {
        // Simulate processing
        Thread.sleep(1000);
        return new Greeting("Goodbye, " + HtmlUtils.htmlEscape(message.name()) + "!");
    }

}
