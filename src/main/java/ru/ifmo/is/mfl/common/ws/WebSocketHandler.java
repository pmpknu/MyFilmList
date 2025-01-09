package ru.ifmo.is.mfl.common.ws;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@RequiredArgsConstructor
public class WebSocketHandler<T> extends TextWebSocketHandler {

  private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
  private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session) {
    sessions.add(session);
  }

  @Override
  public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
    sessions.remove(session);
  }

  private void sendMessageToAll(String message) {
    for (var session : sessions) {
      try {
        if (session.isOpen()) {
          session.sendMessage(new TextMessage(message));
        }
      } catch (Exception ex) {
        logger.warn(ex.getLocalizedMessage());
      }
    }
  }
}
