export enum BpmnElement {
    Process = 'bpmn:Process',
    IntermediateCatchEvent = 'bpmn:IntermediateCatchEvent',
    IntermediateThrowEvent = 'bpmn:IntermediateThrowEvent',
    StartEvent = 'bpmn:StartEvent',
    EndEvent = 'bpmn:EndEvent',
    SequenceFlow = 'bpmn:SequenceFlow',
    ExclusiveGateway = 'bpmn:ExclusiveGateway',
    InclusiveGateway = 'bpmn:InclusiveGateway',
    ParallelGateway = 'bpmn:ParallelGateway',
    ComplexGateway = 'bpmn:ComplexGateway',
    EventBasedGateway = 'bpmn:EventBasedGateway',
    ServiceTask = 'bpmn:ServiceTask',
    UserTask = 'bpmn:UserTask',
    CallActivity = 'bpmn:CallActivity'
}
