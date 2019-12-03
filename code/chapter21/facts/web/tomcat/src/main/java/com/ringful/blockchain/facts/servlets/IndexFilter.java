package com.ringful.blockchain.facts.servlets;

import com.ringful.blockchain.facts.abci.FactsApp;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.*;

public class IndexFilter implements Filter {

    private FactsApp app;
    FilterConfig config;

    public void destroy() { }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (app == null) {
            app = (FactsApp) config.getServletContext().getAttribute("app");
        }

        // Check if there is a new fact. If so, submit it to the blockchain.
        String source = request.getParameter("source");
        String stmt = request.getParameter("stmt");
        if (source == null || source.trim().isEmpty() || stmt == null || stmt.trim().isEmpty()) {
            // Do nothing
        } else {
            CloseableHttpClient httpclient = HttpClients.createDefault();
            HttpGet httpGet = new HttpGet("http://localhost:46657/broadcast_tx_commit?tx=%22" +
                    URLEncoder.encode(source) + ":" + URLEncoder.encode(stmt) + "%22");
            CloseableHttpResponse resp = httpclient.execute(httpGet);

            try {
                System.out.println(resp.getStatusLine());
                HttpEntity entity = resp.getEntity();
                System.out.println(EntityUtils.toString(entity));
                // EntityUtils.consume(entity);
            } finally {
                resp.close();
            }
        }

        // Sends the application data store to the web page for JSTL to display in a table.
        request.setAttribute("facts", app.db);

        chain.doFilter(request, response);
    }

    public void init(FilterConfig filterConfig) throws ServletException {
        this.config = filterConfig;
    }

}
