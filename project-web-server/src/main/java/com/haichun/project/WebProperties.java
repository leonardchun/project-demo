package com.haichun.project;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

/*
 * 文件名：WebProperties
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 16:21 .
 */
@ConfigurationProperties(
        prefix = "fable.web"
)
public class WebProperties {
    private String[] crosMappings = new String[]{"/**"};
    private WebProperties.Swagger swagger = new WebProperties.Swagger();
    private WebProperties.Jsonp jsonp = new WebProperties.Jsonp();
    private WebProperties.ResourceHandler[] resourceHandlers = new WebProperties.ResourceHandler[0];
    private Map<String, String> redirectRegistrations = new HashMap();
    private WebProperties.Authenticated authenticated = new WebProperties.Authenticated();

    public WebProperties() {
    }

    public Map<String, String> getRedirectRegistrations() {
        return this.redirectRegistrations;
    }

    public void setRedirectRegistrations(Map<String, String> redirectRegistrations) {
        this.redirectRegistrations = redirectRegistrations;
    }

    public String[] getCrosMappings() {
        return this.crosMappings;
    }

    public void setCrosMappings(String[] crosMappings) {
        this.crosMappings = crosMappings;
    }

    public WebProperties.Swagger getSwagger() {
        return this.swagger;
    }

    public void setSwagger(WebProperties.Swagger swagger) {
        this.swagger = swagger;
    }

    public WebProperties.Jsonp getJsonp() {
        return this.jsonp;
    }

    public void setJsonp(WebProperties.Jsonp jsonp) {
        this.jsonp = jsonp;
    }

    public WebProperties.Authenticated getAuthenticated() {
        return this.authenticated;
    }

    public void setAuthenticated(WebProperties.Authenticated authenticated) {
        this.authenticated = authenticated;
    }

    public static class ResourceHandler {
        private String pathPattern;
        private String[] staticLocations;

        public ResourceHandler() {
        }
    }

    public static class Jsonp {
        private String callbackParam = "callback";

        public Jsonp() {
        }

        public String getCallbackParam() {
            return this.callbackParam;
        }

        public void setCallbackParam(String callbackParam) {
            this.callbackParam = callbackParam;
        }
    }

    public static class Swagger {
        private boolean enable = true;
        private String[] includePatterns = new String[]{".*"};
        private String title = "Swagger";
        private String description = "Swagger api docs";
        private String serviceUrl;
        private String requestHandlerBasePackage = null;
        private String contactName;
        private String contactUrl;
        private String contactEmail;
        private String license;
        private String licenseUrl;
        private String version = "1.0";

        public Swagger() {
        }

        public String[] getIncludePatterns() {
            return this.includePatterns;
        }

        public void setIncludePatterns(String[] includePatterns) {
            this.includePatterns = includePatterns;
        }

        public String getTitle() {
            return this.title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return this.description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getServiceUrl() {
            return this.serviceUrl;
        }

        public void setServiceUrl(String serviceUrl) {
            this.serviceUrl = serviceUrl;
        }

        public String getLicense() {
            return this.license;
        }

        public void setLicense(String license) {
            this.license = license;
        }

        public String getLicenseUrl() {
            return this.licenseUrl;
        }

        public void setLicenseUrl(String licenseUrl) {
            this.licenseUrl = licenseUrl;
        }

        public String getVersion() {
            return this.version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getContactName() {
            return this.contactName;
        }

        public void setContactName(String contactName) {
            this.contactName = contactName;
        }

        public String getContactUrl() {
            return this.contactUrl;
        }

        public void setContactUrl(String contactUrl) {
            this.contactUrl = contactUrl;
        }

        public String getContactEmail() {
            return this.contactEmail;
        }

        public void setContactEmail(String contactEmail) {
            this.contactEmail = contactEmail;
        }

        public String getRequestHandlerBasePackage() {
            return this.requestHandlerBasePackage;
        }

        public void setRequestHandlerBasePackage(String requestHandlerBasePackage) {
            this.requestHandlerBasePackage = requestHandlerBasePackage;
        }
    }

    public static class Authenticated {
        private String[] excludeUrls;

        public Authenticated() {
        }

        public String[] getExcludeUrls() {
            return this.excludeUrls;
        }

        public void setExcludeUrls(String[] excludeUrls) {
            this.excludeUrls = excludeUrls;
        }
    }
}