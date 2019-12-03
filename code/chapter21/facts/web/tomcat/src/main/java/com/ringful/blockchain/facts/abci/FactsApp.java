package com.ringful.blockchain.facts.abci;

import com.github.jtendermint.jabci.api.ICheckTx;
import com.github.jtendermint.jabci.api.ICommit;
import com.github.jtendermint.jabci.api.IDeliverTx;
import com.github.jtendermint.jabci.api.IQuery;
import com.github.jtendermint.jabci.socket.TSocket;
import com.github.jtendermint.jabci.types.Types.*;
import com.google.protobuf.ByteString;

import java.nio.charset.Charset;
import java.util.Hashtable;
import java.util.Set;

public final class FactsApp implements IDeliverTx, ICheckTx, ICommit, IQuery {

    public static Hashtable<String, Integer> db;
    public static Hashtable<String, Integer> cache;

    private TSocket socket;

    public static void main(String[] args) throws Exception {
        new FactsApp ();
    }

    public FactsApp () throws InterruptedException {
        System.out.println("Starting Facts App");
        socket = new TSocket();
        socket.registerListener(this);

        // Init the database
        db = new Hashtable <String, Integer> ();
        cache = new Hashtable <String, Integer> ();

        // Do NOT subclass FactsApp
        Thread t = new Thread(socket::start);
        t.setName("Facts App Thread");
        t.start();
        // while (true) {
        //     Thread.sleep(1000L);
        // }
    }

    @Override
    public ResponseCheckTx requestCheckTx (RequestCheckTx req) {
        ByteString tx = req.getTx();
        // String payload = TSocket.byteArrayToString(tx.toByteArray());
        String payload = tx.toStringUtf8();
        System.out.println("Check tx : " + payload);
        if (payload == null || payload.isEmpty()) {
            return ResponseCheckTx.newBuilder().setCode(CodeType.UnknownRequest).setLog("payload is empty").build();
        }

        String [] parts = payload.split(":", 2);
        String source = "";
        String statement = "";
        try {
            source = parts[0].trim();
            statement = parts[1].trim();
            if (source.isEmpty() || statement.isEmpty()) {
                throw new Exception("Payload parsing error");
            }
        } catch (Exception e) {
            return ResponseCheckTx.newBuilder().setCode(CodeType.UnknownRequest).setLog(e.getMessage()).build();
        }
        System.out.println("The source is : " + source);
        System.out.println("The statement is : " + statement);

        System.out.println("The fact is in the right format!");
        return ResponseCheckTx.newBuilder().setCode(CodeType.OK).build();
    }

    @Override
    public ResponseDeliverTx receivedDeliverTx (RequestDeliverTx req) {
        ByteString tx = req.getTx();
        // String payload = TSocket.byteArrayToString(tx.toByteArray());
        String payload = tx.toStringUtf8();
        System.out.println("Deliver tx : " + payload);
        if (payload == null || payload.isEmpty()) {
            return ResponseDeliverTx.newBuilder().setCode(CodeType.UnknownRequest).setLog("payload is empty").build();
        }

        String [] parts = payload.split(":", 2);
        String source = "";
        String statement = "";
        try {
            source = parts[0].trim();
            statement = parts[1].trim();
            if (source.isEmpty() || statement.isEmpty()) {
                throw new Exception("Payload parsing error");
            }
        } catch (Exception e) {
            return ResponseDeliverTx.newBuilder().setCode(CodeType.UnknownRequest).setLog(e.getMessage()).build();
        }
        System.out.println("The source is : " + source);
        System.out.println("The statement is : " + statement);

        // In the delivertx message handler, we will only count facts in this block.
        if (cache.containsKey(source)) {
            int count = cache.get(source);
            cache.put(source, count++);
            System.out.println("The count in this block is : " + count);
        } else {
            cache.put(source, 1);
            System.out.println("The count in this block is : " + 1);
        }

        System.out.println("The fact is validated by this node!");
        return ResponseDeliverTx.newBuilder().setCode(CodeType.OK).build();
    }

    @Override
    public ResponseCommit requestCommit (RequestCommit requestCommit) {
        System.out.println("Commit " + cache.keySet().size() + " items");
        Set<String> keys = cache.keySet();
        for (String source: keys) {
            System.out.println("Source : " + source);
            if (db.containsKey(source)) {
                db.put(source, cache.get(source) + db.get(source));
            } else {
                db.put(source, cache.get(source));
            }
        }
        cache.clear();

        return ResponseCommit.newBuilder().setCode(CodeType.OK).build();
    }

    @Override
    public ResponseQuery requestQuery (RequestQuery req) {
        String query = req.getData().toStringUtf8();
        System.out.println("Query : " + query);

        if (query.equalsIgnoreCase("all")) {
            StringBuffer buf = new StringBuffer ();
            String prefix = "";
            Set<String> keys = db.keySet();
            for (String source: keys) {
                buf.append(prefix);
                prefix = ",";
                buf.append(source).append(":").append(db.get(source));
            }
            System.out.println(buf.toString());
            return ResponseQuery.newBuilder().setCode(CodeType.OK).setValue(
                    ByteString.copyFromUtf8((buf.toString()))
            ).setLog(buf.toString()).build();
        }

        if (query.startsWith("Source")) {
            String keyword = query.substring(6).trim();
            if (db.containsKey(keyword)) {
                System.out.println(keyword + " : " + db.get(keyword) + " | " + ByteString.copyFromUtf8(db.get(keyword).toString()).toString());
                return ResponseQuery.newBuilder().setCode(CodeType.OK).setValue(
                        ByteString.copyFromUtf8(db.get(keyword).toString())
                ).setLog(db.get(keyword).toString()).build();
            }
        }

        return ResponseQuery.newBuilder().setCode(CodeType.BadNonce).setLog("Invalid query").build();
    }

}
