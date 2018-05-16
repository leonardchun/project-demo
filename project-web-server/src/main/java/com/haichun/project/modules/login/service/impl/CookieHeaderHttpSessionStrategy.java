package com.haichun.project.modules.login.service.impl;

import org.apache.commons.lang.StringUtils;
import org.springframework.session.Session;
import org.springframework.session.web.http.CookieHttpSessionStrategy;
import org.springframework.session.web.http.HttpSessionManager;
import org.springframework.session.web.http.MultiHttpSessionStrategy;
import org.springframework.util.Assert;

import javax.servlet.ServletRequest;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;
import java.util.regex.Pattern;

/*
 * 文件名：CookieHeaderHttpSessionStrategy
 * 描述：〈一句话功能简述〉
 * 创建人： wanghaichun
 * 创建时间：2017/9/18 17:33 .
 */
public class CookieHeaderHttpSessionStrategy implements MultiHttpSessionStrategy, HttpSessionManager {
    private String headerName = "x-auth-token";
    private static final String SESSION_IDS_WRITTEN_ATTR = CookieHttpSessionStrategy.class.getName().concat(".SESSIONS_WRITTEN_ATTR");
    static final String DEFAULT_ALIAS = "0";
    static final String DEFAULT_SESSION_ALIAS_PARAM_NAME = "_s";
    private Pattern ALIAS_PATTERN = Pattern.compile("^[\\w-]{1,50}$");
    private String cookieName = "SESSION";
    private String sessionParam = "_s";
    private boolean isServlet3Plus = this.isServlet3();

    public CookieHeaderHttpSessionStrategy() {
    }

    public String getRequestedSessionId(HttpServletRequest request) {
        String sessionId = request.getHeader(this.headerName);
        if(StringUtils.isEmpty(sessionId)) {
            Map sessionIds = this.getSessionIds(request);
            String sessionAlias = this.getCurrentSessionAlias(request);
            sessionId = (String)sessionIds.get(sessionAlias);
        }

        return sessionId;
    }

    public void setHeaderName(String headerName) {
        Assert.notNull(headerName, "headerName cannot be null");
        this.headerName = headerName;
    }

    public String getCurrentSessionAlias(HttpServletRequest request) {
        if(this.sessionParam == null) {
            return "0";
        } else {
            String u = request.getParameter(this.sessionParam);
            return u == null?"0":(!this.ALIAS_PATTERN.matcher(u).matches()?"0":u);
        }
    }

    public String getNewSessionAlias(HttpServletRequest request) {
        Set sessionAliases = this.getSessionIds(request).keySet();
        if(sessionAliases.isEmpty()) {
            return "0";
        } else {
            long lastAlias = Long.decode("0").longValue();
            Iterator var5 = sessionAliases.iterator();

            while(var5.hasNext()) {
                String alias = (String)var5.next();
                long selectedAlias = this.safeParse(alias);
                if(selectedAlias > lastAlias) {
                    lastAlias = selectedAlias;
                }
            }

            return Long.toHexString(lastAlias + 1L);
        }
    }

    private long safeParse(String hex) {
        try {
            return Long.decode("0x" + hex).longValue();
        } catch (NumberFormatException var3) {
            return 0L;
        }
    }

    public void onNewSession(Session session, HttpServletRequest request, HttpServletResponse response) {
        response.setHeader(this.headerName, session.getId());
        Set sessionIdsWritten = this.getSessionIdsWritten(request);
        if(!sessionIdsWritten.contains(session.getId())) {
            sessionIdsWritten.add(session.getId());
            Map sessionIds = this.getSessionIds(request);
            String sessionAlias = this.getCurrentSessionAlias(request);
            sessionIds.put(sessionAlias, session.getId());
            Cookie sessionCookie = this.createSessionCookie(request, sessionIds);
            response.addCookie(sessionCookie);
        }
    }

    private Set<String> getSessionIdsWritten(HttpServletRequest request) {
        Object sessionsWritten = (Set)request.getAttribute(SESSION_IDS_WRITTEN_ATTR);
        if(sessionsWritten == null) {
            sessionsWritten = new HashSet();
            request.setAttribute(SESSION_IDS_WRITTEN_ATTR, sessionsWritten);
        }

        return (Set)sessionsWritten;
    }

    private Cookie createSessionCookie(HttpServletRequest request, Map<String, String> sessionIds) {
        Cookie sessionCookie = new Cookie(this.cookieName, "");
        if(this.isServlet3Plus) {
            sessionCookie.setHttpOnly(true);
        }

        sessionCookie.setSecure(request.isSecure());
        sessionCookie.setPath(cookiePath(request));
        if(sessionIds.isEmpty()) {
            sessionCookie.setMaxAge(0);
            return sessionCookie;
        } else if(sessionIds.size() == 1) {
            String buffer1 = (String)sessionIds.values().iterator().next();
            sessionCookie.setValue(buffer1);
            return sessionCookie;
        } else {
            StringBuffer buffer = new StringBuffer();
            Iterator var5 = sessionIds.entrySet().iterator();

            while(var5.hasNext()) {
                Map.Entry entry = (Map.Entry)var5.next();
                String alias = (String)entry.getKey();
                String id = (String)entry.getValue();
                buffer.append(alias);
                buffer.append(" ");
                buffer.append(id);
                buffer.append(" ");
            }

            buffer.deleteCharAt(buffer.length() - 1);
            sessionCookie.setValue(buffer.toString());
            return sessionCookie;
        }
    }

    public void onInvalidateSession(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader(this.headerName, "");
        Map sessionIds = this.getSessionIds(request);
        String requestedAlias = this.getCurrentSessionAlias(request);
        sessionIds.remove(requestedAlias);
        Cookie sessionCookie = this.createSessionCookie(request, sessionIds);
        response.addCookie(sessionCookie);
    }

    public void setSessionAliasParamName(String sessionAliasParamName) {
        this.sessionParam = sessionAliasParamName;
    }

    public void setCookieName(String cookieName) {
        if(cookieName == null) {
            throw new IllegalArgumentException("cookieName cannot be null");
        } else {
            this.cookieName = cookieName;
        }
    }

    private static Cookie getCookie(HttpServletRequest request, String name) {
        if(request == null) {
            throw new IllegalArgumentException("request cannot be null");
        } else {
            Cookie[] cookies = request.getCookies();
            if(cookies != null) {
                Cookie[] var3 = cookies;
                int var4 = cookies.length;

                for(int var5 = 0; var5 < var4; ++var5) {
                    Cookie cookie = var3[var5];
                    if(name.equals(cookie.getName())) {
                        return cookie;
                    }
                }
            }

            return null;
        }
    }

    private static String cookiePath(HttpServletRequest request) {
        return request.getContextPath() + "/";
    }

    public Map<String, String> getSessionIds(HttpServletRequest request) {
        Cookie session = getCookie(request, this.cookieName);
        String sessionCookieValue = session == null?"":session.getValue();
        LinkedHashMap result = new LinkedHashMap();
        StringTokenizer tokens = new StringTokenizer(sessionCookieValue, " ");
        if(tokens.countTokens() == 1) {
            result.put("0", tokens.nextToken());
            return result;
        } else {
            while(tokens.hasMoreTokens()) {
                String alias = tokens.nextToken();
                if(!tokens.hasMoreTokens()) {
                    break;
                }

                String id = tokens.nextToken();
                result.put(alias, id);
            }

            return result;
        }
    }

    public HttpServletRequest wrapRequest(HttpServletRequest request, HttpServletResponse response) {
        request.setAttribute(HttpSessionManager.class.getName(), this);
        return request;
    }

    public HttpServletResponse wrapResponse(HttpServletRequest request, HttpServletResponse response) {
        return new CookieHeaderHttpSessionStrategy.MultiSessionHttpServletResponse(response, request);
    }

    public String encodeURL(String url, String sessionAlias) {
        String encodedSessionAlias = this.urlEncode(sessionAlias);
        int queryStart = url.indexOf("?");
        boolean isDefaultAlias = "0".equals(encodedSessionAlias);
        if(queryStart < 0) {
            return isDefaultAlias?url:url + "?" + this.sessionParam + "=" + encodedSessionAlias;
        } else {
            String path = url.substring(0, queryStart);
            String query = url.substring(queryStart + 1, url.length());
            String replacement = isDefaultAlias?"":"$1" + encodedSessionAlias;
            query = query.replaceFirst("((^|&)" + this.sessionParam + "=)([^&]+)?", replacement);
            if(!isDefaultAlias && url.endsWith(query)) {
                if(!query.endsWith("&") && query.length() != 0) {
                    query = query + "&";
                }

                query = query + this.sessionParam + "=" + encodedSessionAlias;
            }

            return path + "?" + query;
        }
    }

    private String urlEncode(String value) {
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (UnsupportedEncodingException var3) {
            throw new RuntimeException(var3);
        }
    }

    private boolean isServlet3() {
        try {
            ServletRequest.class.getMethod("startAsync", new Class[0]);
            return true;
        } catch (NoSuchMethodException var2) {
            return false;
        }
    }

    class MultiSessionHttpServletResponse extends HttpServletResponseWrapper {
        private final HttpServletRequest request;

        public MultiSessionHttpServletResponse(HttpServletResponse response, HttpServletRequest request) {
            super(response);
            this.request = request;
        }

        public String encodeRedirectURL(String url) {
            url = super.encodeRedirectURL(url);
            return CookieHeaderHttpSessionStrategy.this.encodeURL(url, CookieHeaderHttpSessionStrategy.this.getCurrentSessionAlias(this.request));
        }

        public String encodeURL(String url) {
            url = super.encodeURL(url);
            String alias = CookieHeaderHttpSessionStrategy.this.getCurrentSessionAlias(this.request);
            return CookieHeaderHttpSessionStrategy.this.encodeURL(url, alias);
        }
    }
}
