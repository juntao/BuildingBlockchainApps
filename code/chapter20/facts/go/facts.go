package main

import (
  "flag"
  "os"
  "strings"
  "bytes"
  "strconv"
  "github.com/tendermint/abci/example/code"
  "github.com/tendermint/abci/server"
  "github.com/tendermint/abci/types"
  cmn "github.com/tendermint/tmlibs/common"
  "github.com/tendermint/tmlibs/log"
  "encoding/binary"
)

func main() {
  addrPtr := flag.String("addr", "tcp://0.0.0.0:46658", "Listen ad-dress")
  abciPtr := flag.String("abci", "socket", "socket | grpc")
  flag.Parse()

  logger := log.NewTMLogger(log.NewSyncWriter(os.Stdout))

  var app types.Application
  app = NewFactsApplication()
  // Start the listener
  srv, err := server.NewServer(*addrPtr, *abciPtr, app)
  if err != nil {
    logger.Error(err.Error())
    os.Exit(1)
  }
  srv.SetLogger(logger.With("module", "abci-server"))
  if err := srv.Start(); err != nil {
    logger.Error(err.Error())
    os.Exit(1)
  }

  // Wait forever
  cmn.TrapSignal(func() {
    // Cleanup
    srv.Stop()
  })
}

type FactsApplication struct {
  types.BaseApplication

  db map[string]int
  cache map[string]int
}

func NewFactsApplication() *FactsApplication {
  db := make(map[string]int)
  cache := make(map[string]int)
  return &FactsApplication{db: db, cache: cache}
}

func (app *FactsApplication) CheckTx (tx []byte) types.ResponseCheckTx {
  parts := strings.Split(string(tx), ":")
  source := strings.TrimSpace(parts[0])
  statement := strings.TrimSpace(parts[1])
  if (len(source) == 0) || (len(statement) == 0) {
    return types.ResponseCheckTx{Code:code.CodeTypeEncodingError, Log:"Empty Input"}
  }
  return types.ResponseCheckTx{Code: code.CodeTypeOK}
}

func (app *FactsApplication) DeliverTx (tx []byte) types.ResponseDeliverTx {
  parts := strings.Split(string(tx), ":")
  source := strings.TrimSpace(parts[0])
  statement := strings.TrimSpace(parts[1])
  if (len(source) == 0) || (len(statement) == 0) {
    return types.ResponseDeliverTx{Code:code.CodeTypeEncodingError, Log:"Empty Input"}
  }

  if val, ok := app.cache[source]; ok {
    app.cache[source] = val + 1
  } else {
    app.cache[source] = 1
  }
  return types.ResponseDeliverTx{Code: code.CodeTypeOK}
}

func (app *FactsApplication) Commit() types.ResponseCommit {
  totalCount := 0
  for source, v := range app.cache {
    if val, ok := app.db[source]; ok {
      app.db[source] = val + v
    } else {
      app.db[source] = v
    }
    totalCount = totalCount + v
  }
  app.cache = make(map[string]int)

  hash := make([]byte, 8)
  binary.BigEndian.PutUint64(hash, uint64(totalCount))
  return types.ResponseCommit{Data: hash}
}

func (app *FactsApplication) Query (reqQuery types.RequestQuery) (resQuery types.ResponseQuery) {
  query := string(reqQuery.Data)

  if (strings.EqualFold(query, "all")) {
    var buffer bytes.Buffer
    var prefix = ""
    for source, v := range app.db {
      buffer.WriteString(prefix)
      prefix = ","
      buffer.WriteString(source)
      buffer.WriteString(":")
      buffer.WriteString(strconv.Itoa(v))
    }
    resQuery.Value = buffer.Bytes()
    resQuery.Log = buffer.String()
  }

  if (strings.HasPrefix(query, "Source")) {
    source := query[6:len(query)]
    if val, ok := app.db[source]; ok {
      resQuery.Value = []byte(strconv.Itoa(val))
      resQuery.Log = string(val)
    }
  }

  return
}

