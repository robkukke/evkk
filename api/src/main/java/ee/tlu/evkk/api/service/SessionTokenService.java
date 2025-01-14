package ee.tlu.evkk.api.service;

import ee.tlu.evkk.dal.dao.SessionTokenDao;
import ee.tlu.evkk.dal.dto.SessionToken;
import ee.tlu.evkk.api.exception.InvalidSessionException;
import org.springframework.session.Session;
import org.springframework.session.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

/**
 * @author Mikk Tarvas
 * Date: 12.02.2020
 */
@Service
public class SessionTokenService {

  private final SessionTokenDao sessionTokenDao;
  private final SessionRepository<?> sessionRepository;

  public SessionTokenService(SessionTokenDao sessionTokenDao,
                             @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection") SessionRepository<?> sessionRepository) {
    this.sessionTokenDao = sessionTokenDao;
    this.sessionRepository = sessionRepository;
  }

  public UUID getSessionTokenId(UUID userId, String sessionId) {
    Objects.requireNonNull(userId);
    Objects.requireNonNull(sessionId);
    sessionTokenDao.upsert(userId, sessionId);
    return sessionTokenDao.findIdByUserIdAndSessionId(userId, sessionId);
  }

  public SessionToken getSessionToken(UUID sessionTokenId) throws InvalidSessionException {
    Objects.requireNonNull(sessionTokenId);
    SessionToken sessionToken = sessionTokenDao.findById(sessionTokenId);
    if (sessionToken == null) throw new InvalidSessionException();
    Session session = sessionRepository.findById(sessionToken.getSessionId());
    if (session == null || session.isExpired()) throw new InvalidSessionException();
    return sessionToken;
  }

}
