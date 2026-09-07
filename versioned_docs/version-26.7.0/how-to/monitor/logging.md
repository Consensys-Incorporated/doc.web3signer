---
description: Configure Web3Signer's log level settings and log formatting.
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure logging

Web3Signer provides multiple methods to configure logging:

- [Basic](#basic-log-level-setting) - Change the log level or structured logging format.
- [Advanced](#advanced-custom-logging) - Configure the output and format of the logs.

## Basic log level setting

Use the [`--logging`](../../reference/cli/options.md#logging) command line option to specify logging verbosity.
This option changes the volume of events displayed in the log.
Valid log levels are `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, `ALL`.
The default level is `INFO`.

Use the [`--logging-format`](../../reference/cli/options.md#logging-format) option to specify the logging format.
You can select a structured logging format, which emits each log record as a JSON object in a well-defined format, making logs consistent and machine-readable.
Valid formats are `PLAIN`, `ECS`, `GCP`, `LOGSTASH`, `GELF`.
The default format is `PLAIN`, which specifies traditional pattern-based text logging.

## Advanced custom logging

You can provide your own logging configuration using the standard Log4J2 configuration mechanisms.

Web3Signer includes the Log4J JSON Template Layout library, which enables production-ready templates for each structured logging format.
Specify `JsonTemplateLayout` in your configuration file to use the Log4J templates.

The following is an example of a custom configuration file, a configuration file using the default Elastic Common Schema (ECS) template,
and a configuration file using the Google Cloud Platform (GCP) template.
For more information, see the Log4j [configuration file](https://logging.apache.org/log4j/2.x/manual/configuration.html) and
[event templates](https://logging.apache.org/log4j/2.x/manual/json-template-layout.html#event-templates) documentation.

<Tabs>
<TabItem value="Custom configuration">

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration level="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
    <Property name="dependency.log.level">INFO</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSSZZZ} | %t | %-5level | %c{1} | %msg%n"/>
    </Console>
  </Appenders>
  <Loggers>
    <Logger name="com.azure.security.keyvault.secrets.SecretAsyncClient"
      level="${dependency.log.level}" additivity="false">
      <AppenderRef ref="Console"/>
    </Logger>
    <Logger name="com.networknt.schema" level="${env:dependency.log.level}" additivity="false">
      <AppenderRef ref="Console"/>
    </Logger>
    <Logger name="org.jdbi.v3.core" level="${env:dependency.log.level}" additivity="false">
      <AppenderRef ref="Console"/>
    </Logger>
    <Logger name="com.zaxxer.hikari" level="${env:dependency.log.level}" additivity="false">
      <AppenderRef ref="Console"/>
    </Logger>
    <Logger name="io.swagger.v3" level="${env:dependency.log.level}"
      additivity="false">
      <AppenderRef ref="Console"/>
    </Logger>
    <Logger name="io.netty" level="${env:dependency.log.level}" additivity="false">
      <AppenderRef ref="Console"/>
    </Logger>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
```

</TabItem>
<TabItem value="With default ECS template">

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration level="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <JsonTemplateLayout/>
    </Console>
  </Appenders>
  <Loggers>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
```

</TabItem>
<TabItem value="With GCP template">

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration level="INFO">
  <Properties>
    <Property name="root.log.level">INFO</Property>
  </Properties>

  <Appenders>
    <Console name="Console" target="SYSTEM_OUT">
      <JsonTemplateLayout eventTemplateUri="classpath:GcpLayout.json"/>
    </Console>
  </Appenders>
  <Loggers>
    <Root level="${sys:root.log.level}">
      <AppenderRef ref="Console"/>
    </Root>
  </Loggers>
</Configuration>
```

</TabItem>
</Tabs>

To use your custom configuration, set the environment variable `JAVA_OPTS` to the location of your
configuration file.

```bash
export JAVA_OPTS="-Dlog4j.configurationFile=<path_to_file>"
```

For Bash-based executions, you can set the variable for only the scope of the program execution by
setting it before starting Web3Signer.

```bash title="Set the custom logging and start Web3Signer"
JAVA_OPTS="-Dlog4j.configurationFile=/Users/me/debug.xml" web3signer --key-store-path=/Users/me/keyFiles/ eth2
```

:::info Note
When a custom Log4j2 configuration file is provided, it takes precedence over the [logging command line options](#basic-log-level-setting).
:::
