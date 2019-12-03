package com.ringful.blockchain.facts.servlets;

import com.ringful.blockchain.facts.abci.FactsApp;
import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.GenericServlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class StartupServlet extends GenericServlet {

    private static final Logger log = Logger.getLogger(StartupServlet.class.getName());

    public void init(ServletConfig servletConfig) throws ServletException {

        super.init(servletConfig);

        try {
            // This starts the ABCI listener sockets
            FactsApp app = new FactsApp ();

            getServletContext().setAttribute("app", app);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void service(ServletRequest serveletRequest, ServletResponse servletResponse) throws ServletException, IOException {
    }

}
