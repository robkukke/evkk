package ee.tlu.evkk.api.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.util.StreamUtils.copyToString;

@Component
public class FileUtils {

  private FileUtils() {}

  public static String readResourceAsString(@NotNull String path) throws IOException {
    ClassPathResource resource = new ClassPathResource(path);
    try (InputStream stream = resource.getInputStream()) {
      return readFromStream(stream);
    }
  }

  private static String readFromStream(InputStream inputStream) throws IOException {
    return copyToString(inputStream, UTF_8);
  }
}